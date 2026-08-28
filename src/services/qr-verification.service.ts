import { eq } from "drizzle-orm";

import { db } from "../db";

import {
  deliveryRequests,
  deliveryStatusHistory,
} from "../db/schema";

import {
  createProofOfDelivery,
} from "./proof-of-delivery.service";
export const verifyDeliveryQr =
  async (
    deliveryId: number,
    qrCode: string,
    riderUserId: number,
    recipientName: string
  ) => {

    const delivery =
      await db.query.deliveryRequests.findFirst({
        where: eq(
          deliveryRequests.id,
          deliveryId
        ),
      });

    if (!delivery) {
      throw new Error(
        "Delivery not found"
      );
    }

    if (
      delivery.deliveryQrCode !==
      qrCode
    ) {
      throw new Error(
        "Invalid QR code"
      );
    }

    const [updatedDelivery] =
      await db
        .update(deliveryRequests)
        .set({
          status: "delivered",
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

        status: "delivered",

        updatedBy:
          riderUserId,

        notes:
          "QR verified delivery",
      });

    await createProofOfDelivery({
      deliveryRequestId:
        deliveryId,

      recipientName,
    });

    return updatedDelivery;
  };