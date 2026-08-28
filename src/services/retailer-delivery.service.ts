import { and, eq } from "drizzle-orm";

import { db } from "../db";

import {
  retailers,
  deliveryRequests,
} from "../db/schema";

export const getRetailerDeliveries =
  async (
    userId: number
  ) => {

    const retailer =
      await db.query.retailers.findFirst({
        where: eq(
          retailers.userId,
          userId
        ),
      });

    if (!retailer) {
      throw new Error(
        "Retailer not found"
      );
    }

    return await db.query.deliveryRequests.findMany({
      where: eq(
        deliveryRequests.retailerId,
        retailer.id
      ),
    });
  };

export const getRetailerDeliveriesByStatus =
  async (
    userId: number,
    status:
      | "open"
      | "assigned"
      | "picked_up"
      | "in_transit"
      | "delivered"
      | "failed"
      | "cancelled"
  ) => {

    const retailer =
      await db.query.retailers.findFirst({
        where: eq(
          retailers.userId,
          userId
        ),
      });

    if (!retailer) {
      throw new Error(
        "Retailer not found"
      );
    }

    return await db.query.deliveryRequests.findMany({
      where: and(
        eq(
          deliveryRequests.retailerId,
          retailer.id
        ),
        eq(
          deliveryRequests.status,
          status
        )
      ),
    });
  };