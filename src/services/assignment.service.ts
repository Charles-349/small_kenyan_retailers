import { eq } from "drizzle-orm";

import { db } from "../db";

import {
  dispatchers,
  riders,
  deliveryRequests,
  deliveryAssignments,
  deliveryStatusHistory,
} from "../db/schema";

export const assignDelivery = async (
  dispatcherUserId: number,
  deliveryRequestId: number,
  riderId: number
) => {
  const dispatcher =
    await db.query.dispatchers.findFirst({
      where: eq(
        dispatchers.userId,
        dispatcherUserId
      ),
    });

  if (!dispatcher) {
    throw new Error(
      "Dispatcher profile not found"
    );
  }

  const rider =
    await db.query.riders.findFirst({
      where: eq(
        riders.id,
        riderId
      ),
    });

  if (!rider) {
    throw new Error(
      "Rider not found"
    );
  }

  const delivery =
    await db.query.deliveryRequests.findFirst({
      where: eq(
        deliveryRequests.id,
        deliveryRequestId
      ),
    });

  if (!delivery) {
    throw new Error(
      "Delivery not found"
    );
  }

  if (delivery.status !== "open") {
    throw new Error(
      "Delivery already assigned"
    );
  }

  const [assignment] = await db
    .insert(deliveryAssignments)
    .values({
      deliveryRequestId,
      riderId,
      dispatcherId:
        dispatcher.id,
      status: "pending",
    })
    .returning();

  const [updatedDelivery] =
    await db
      .update(deliveryRequests)
      .set({
        status: "assigned",
      })
      .where(
        eq(
          deliveryRequests.id,
          deliveryRequestId
        )
      )
      .returning();

  await db
    .insert(
      deliveryStatusHistory
    )
    .values({
      deliveryRequestId,
      status: "assigned",
      updatedBy:
        dispatcherUserId,
      notes:
        "Assigned to rider",
    });

  return {
    assignment,
    delivery:
      updatedDelivery,
  };
};