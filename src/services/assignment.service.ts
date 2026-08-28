import { db } from "../db";
import {
  deliveryAssignments,
  deliveryRequests,
  riders,
  riderLocations,
  deliveryStatusHistory,
} from "../db/schema";
import { eq, desc } from "drizzle-orm";
import { calculateDistanceKm } from "../utils/geo";
import { Server } from "socket.io";

export class AssignmentService {
  /**
   * Manual assignment of a rider to a delivery request
   */
  static async assignDelivery(data: {
    deliveryRequestId: number;
    riderId: number;
    dispatcherId: number;
  }) {
    const { deliveryRequestId, riderId, dispatcherId } = data;

    const rider = await db.query.riders.findFirst({
      where: eq(riders.id, riderId),
    });
    if (!rider) throw new Error("Rider not found");

    const delivery = await db.query.deliveryRequests.findFirst({
      where: eq(deliveryRequests.id, deliveryRequestId),
    });
    if (!delivery) throw new Error("Delivery not found");
    if (delivery.status !== "open") throw new Error("Delivery already assigned or closed");

    const [assignment] = await db
      .insert(deliveryAssignments)
      .values({
        deliveryRequestId,
        riderId,
        dispatcherId,
        status: "assigned",
      })
      .returning();

    await db
      .update(deliveryRequests)
      .set({ status: "assigned" })
      .where(eq(deliveryRequests.id, deliveryRequestId));

    await db.insert(deliveryStatusHistory).values({
      deliveryRequestId,
      status: "assigned",
      note: `Manually assigned to rider ${riderId}`,
    });

    return assignment;
  }

  /**
   * Auto-assigns the nearest online rider and broadcasts via Socket.io
   */
  static async autoAssignNearestRider(
    deliveryRequestId: number,
    dispatcherId: number,
    io?: Server
  ) {
    const delivery = await db.query.deliveryRequests.findFirst({
      where: eq(deliveryRequests.id, deliveryRequestId),
    });

    if (!delivery) throw new Error("Delivery request not found");
    if (delivery.status !== "open") throw new Error("Delivery is already assigned or closed");

    // Fetch all active riders
    const activeRiders = await db.query.riders.findMany({
      where: eq(riders.status, "available"),
    });

    if (activeRiders.length === 0) {
      return { success: false, message: "No available riders at the moment" };
    }

    // Calculate distance for each rider based on their latest GPS ping
    const riderDistances: { rider: typeof activeRiders[0]; distance: number }[] = [];
    const delLat = parseFloat(delivery.latitude);
    const delLng = parseFloat(delivery.longitude);

    for (const r of activeRiders) {
      const latestLoc = await db.query.riderLocations.findFirst({
        where: eq(riderLocations.riderId, r.id),
        orderBy: [desc(riderLocations.createdAt)],
      });

      if (latestLoc) {
        const distance = calculateDistanceKm(
          delLat,
          delLng,
          parseFloat(latestLoc.latitude),
          parseFloat(latestLoc.longitude)
        );
        riderDistances.push({ rider: r, distance });
      }
    }

    // Sort riders by closest distance
    riderDistances.sort((a, b) => a.distance - b.distance);

    const matchedRider =
      riderDistances.length > 0 ? riderDistances[0].rider : activeRiders[0];

    // Create assignment record
    const [assignment] = await db
      .insert(deliveryAssignments)
      .values({
        deliveryRequestId,
        riderId: matchedRider.id,
        dispatcherId,
        status: "assigned",
      })
      .returning();

    // Update status to assigned
    await db
      .update(deliveryRequests)
      .set({ status: "assigned" })
      .where(eq(deliveryRequests.id, deliveryRequestId));

    await db.insert(deliveryStatusHistory).values({
      deliveryRequestId,
      status: "assigned",
      note: `Auto-assigned to nearest rider ID: ${matchedRider.id}`,
    });

    // Real-time dispatch push notification to rider via Socket.io
    if (io) {
      io.to(`rider_${matchedRider.id}`).emit("delivery:assigned", {
        assignmentId: assignment.id,
        deliveryRequestId: delivery.id,
        customerName: delivery.customerName,
        customerPhone: delivery.customerPhone,
        deliveryAddress: delivery.deliveryAddress,
        trackingToken: delivery.trackingToken,
      });
    }

    return {
      success: true,
      assignment,
      matchedRiderId: matchedRider.id,
    };
  }
}