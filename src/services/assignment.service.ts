import { db } from "../db";
import { deliveryRequests, riders, deliveryAssignments, deliveryStatusHistory } from "../db/schema";
import { eq } from "drizzle-orm";
import { Server } from "socket.io";

export const assignDelivery = async (
  deliveryRequestId: number,
  riderId: number,
  dispatcherId: number,
  io?: Server
) => {
  try {
    const [assignment] = await db
      .insert(deliveryAssignments)
      .values({
        deliveryRequestId,
        riderId,
        dispatcherId,
        status: "accepted",
      } as any)
      .returning();

    const [updatedDelivery] = await db
      .update(deliveryRequests)
      .set({
        status: "assigned",
        updatedAt: new Date(),
      })
      .where(eq(deliveryRequests.id, deliveryRequestId))
      .returning();

    await db.insert(deliveryStatusHistory).values({
      deliveryRequestId,
      status: "assigned",
      updatedBy: dispatcherId,
      notes: `Rider #${riderId} assigned by dispatcher #${dispatcherId}`,
    } as any);

    if (io && updatedDelivery?.trackingToken) {
      io.to(`track_${updatedDelivery.trackingToken}`).emit("delivery:status:update", {
        status: "assigned",
        riderId,
        timestamp: new Date().toISOString(),
      });
    }

    return { success: true, data: assignment };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const autoAssignNearestRider = async (
  deliveryRequestId: number,
  dispatcherId: number,
  io?: Server
) => {
  try {
    const delivery = await db.query.deliveryRequests.findFirst({
      where: eq(deliveryRequests.id, deliveryRequestId),
    });

    if (!delivery) {
      return { success: false, message: "Delivery request not found" };
    }

    const availableRiders = await db.query.riders.findMany({
      where: eq(riders.isAvailable, true),
    });

    if (!availableRiders.length) {
      return { success: false, message: "No available riders found" };
    }

    const selectedRider = availableRiders[0];

    return await assignDelivery(deliveryRequestId, selectedRider.id, dispatcherId, io);
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export class AssignmentService {
  static assignDelivery = assignDelivery;
  static autoAssignNearestRider = autoAssignNearestRider;
}