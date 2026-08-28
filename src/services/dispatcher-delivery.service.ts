import { eq } from "drizzle-orm";

import { db } from "../db";

import {
  deliveryRequests,
} from "../db/schema";

export const getOpenDeliveries =
  async () => {
    return await db.query.deliveryRequests.findMany({
      where: eq(
        deliveryRequests.status,
        "open"
      ),
    });
  };

  export const getAssignedDeliveries =
  async () => {
    return await db.query.deliveryAssignments.findMany({
      with: {
        rider: true,
        deliveryRequest: true,
      },
    });
  };