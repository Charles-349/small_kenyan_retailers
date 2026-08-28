import { eq } from "drizzle-orm";

import { db } from "../db";

import {
  riders,
  deliveryRequests,
  deliveryAssignments,
  deliveryStatusHistory,
} from "../db/schema";

type DeliveryStatus =
  | "picked_up"
  | "in_transit";

export const updateDeliveryStatus =
  async (
    deliveryId: number,
    riderUserId: number,
    status: DeliveryStatus
  ) => {
    const rider =
      await db.query.riders.findFirst({
        where: eq(
          riders.userId,
          riderUserId
        ),
      });

    if (!rider) {
      throw new Error(
        "Rider not found"
      );
    }

    const assignment =
      await db.query.deliveryAssignments.findFirst({
        where: eq(
          deliveryAssignments
            .deliveryRequestId,
          deliveryId
        ),
      });

    if (!assignment) {
      throw new Error(
        "Assignment not found"
      );
    }

    if (
      assignment.riderId !== rider.id
    ) {
      throw new Error(
        "This delivery is not assigned to you"
      );
    }

    const [delivery] =
      await db
        .update(deliveryRequests)
        .set({
          status,
          updatedAt: new Date(),
        })
        .where(
          eq(
            deliveryRequests.id,
            deliveryId
          )
        )
        .returning();

    await db
      .insert(
        deliveryStatusHistory
      )
      .values({
        deliveryRequestId:
          deliveryId,

        status,

        updatedBy:
          riderUserId,

        notes: `Delivery marked as ${status}`,
      });

    return delivery;
  };