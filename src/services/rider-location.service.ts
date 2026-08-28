import { eq } from "drizzle-orm";

import { db } from "../db";

import {
  riders,
  riderLocations,
} from "../db/schema";

type UpdateLocationInput = {
  riderUserId: number;
  latitude: string;
  longitude: string;
  speed?: number;
  heading?: number;
};

export const updateRiderLocation =
  async (
    data: UpdateLocationInput
  ) => {
    const rider =
      await db.query.riders.findFirst({
        where: eq(
          riders.userId,
          data.riderUserId
        ),
      });

    if (!rider) {
      throw new Error(
        "Rider not found"
      );
    }

    const existing =
      await db.query.riderLocations.findFirst({
        where: eq(
          riderLocations.riderId,
          rider.id
        ),
      });

    if (existing) {
      const [location] =
        await db
          .update(riderLocations)
          .set({
            latitude:
              data.latitude,

            longitude:
              data.longitude,

            speed:
              data.speed,

            heading:
              data.heading,

            updatedAt:
              new Date(),
          })
          .where(
            eq(
              riderLocations.riderId,
              rider.id
            )
          )
          .returning();

      return location;
    }

    const [location] =
      await db
        .insert(riderLocations)
        .values({
          riderId: rider.id,

          latitude:
            data.latitude,

          longitude:
            data.longitude,

          speed:
            data.speed,

          heading:
            data.heading,
        })
        .returning();

    return location;
  };