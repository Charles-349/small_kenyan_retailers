import { eq } from "drizzle-orm";

import { db } from "../db";

import {
  riders,
  deliveryAssignments,
} from "../db/schema";

export const getMyDeliveries =
  async (riderUserId: number) => {

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

    const assignments =
      await db.query.deliveryAssignments.findMany({
        where: eq(
          deliveryAssignments.riderId,
          rider.id
        ),
        with: {
          deliveryRequest: true,
        },
      });

    return assignments;
  };