import { eq } from "drizzle-orm";
import { db } from "../db";

import {
  proofOfDelivery,
} from "../db/schema";

type CreateProofOfDeliveryInput = {
  deliveryRequestId: number;

  recipientName: string;

  qrCode?: string;

  photoUrl?: string;

  signatureUrl?: string;
};

export const createProofOfDelivery =
  async (
    data: CreateProofOfDeliveryInput
  ) => {
    const [proof] =
      await db
        .insert(proofOfDelivery)
        .values({
          deliveryRequestId:
            data.deliveryRequestId,

          recipientName:
            data.recipientName,

          qrCode:
            data.qrCode,

          photoUrl:
            data.photoUrl,

          signatureUrl:
            data.signatureUrl,
        })
        .returning();

    return proof;
  };
  export const getProofOfDelivery =
  async (
    deliveryRequestId: number
  ) => {

    const proof =
      await db.query.proofOfDelivery.findFirst({
        where: eq(
          proofOfDelivery.deliveryRequestId,
          deliveryRequestId
        ),
      });

    if (!proof) {
      throw new Error(
        "Proof of delivery not found"
      );
    }

    return proof;
  };