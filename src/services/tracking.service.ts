import { eq } from "drizzle-orm";

import { db } from "../db";

import {
  deliveryRequests,
  deliveryAssignments,
  riders,
  users,
  riderLocations,
} from "../db/schema";

export const getDeliveryByTrackingToken =
  async (trackingToken: string) => {
    const delivery =
      await db.query.deliveryRequests.findFirst({
        where: eq(
          deliveryRequests.trackingToken,
          trackingToken
        ),
      });

    if (!delivery) {
      throw new Error(
        "Delivery not found"
      );
    }

    const assignment =
      await db.query.deliveryAssignments.findFirst({
        where: eq(
          deliveryAssignments.deliveryRequestId,
          delivery.id
        ),
      });

    let riderInfo = null;
    let locationInfo = null;

    if (assignment) {
      const rider =
        await db.query.riders.findFirst({
          where: eq(
            riders.id,
            assignment.riderId
          ),
        });

      if (rider) {
        const user =
          await db.query.users.findFirst({
            where: eq(
              users.id,
              rider.userId
            ),
          });

        const location =
          await db.query.riderLocations.findFirst({
            where: eq(
              riderLocations.riderId,
              rider.id
            ),
          });

        riderInfo = user
          ? {
              id: rider.id,
              firstName:
                user.firstName,
              lastName:
                user.lastName,
              phone:
                user.phone,
            }
          : null;

        locationInfo = location
          ? {
              latitude:
                location.latitude,
              longitude:
                location.longitude,
              speed:
                location.speed,
              heading:
                location.heading,
              updatedAt:
                location.updatedAt,
            }
          : null;
      }
    }

    return {
      id: delivery.id,
      customerName:
        delivery.customerName,
      deliveryAddress:
        delivery.deliveryAddress,
      itemDescription:
        delivery.itemDescription,
      status:
        delivery.status,
      createdAt:
        delivery.createdAt,

      rider: riderInfo,

      riderLocation:
        locationInfo,
    };
  };