import { eq } from "drizzle-orm";
import crypto from "crypto";
import QRCode from "qrcode";

import { db } from "../db";

import {
  retailers,
  deliveryRequests,
  deliveryStatusHistory,
} from "../db/schema";

type CreateDeliveryInput = {
  userId: number;

  customerName: string;
  customerPhone: string;
  deliveryAddress: string;

  itemDescription: string;

  specialInstructions?: string;

  latitude?: string;
  longitude?: string;
};

export const createDelivery = async (
  data: CreateDeliveryInput
) => {
  console.log(
    "USER ID =",
    data.userId
  );

  const retailer =
    await db.query.retailers.findFirst({
      where: eq(
        retailers.userId,
        data.userId
      ),
    });

  console.log(
    "RETAILER =",
    retailer
  );

  if (!retailer) {
    throw new Error(
      "Retailer profile not found"
    );
  }

  const trackingToken =
    crypto.randomUUID();

  const deliveryVerificationToken =
    crypto.randomUUID();

  const trackingUrl =
    `${
      process.env.FRONTEND_URL ||
      "http://localhost:5173"
    }/track/${trackingToken}`;

  const deliveryQrCode =
    await QRCode.toDataURL(
      deliveryVerificationToken
    );

  const [delivery] = await db
    .insert(deliveryRequests)
    .values({
      retailerId: retailer.id,

      trackingToken,

      deliveryVerificationToken,

      deliveryQrCode,

      customerName:
        data.customerName,

      customerPhone:
        data.customerPhone,

      deliveryAddress:
        data.deliveryAddress,

      itemDescription:
        data.itemDescription,

      specialInstructions:
        data.specialInstructions,

      latitude:
        data.latitude,

      longitude:
        data.longitude,

      status: "open",
    })
    .returning();

  await db
    .insert(deliveryStatusHistory)
    .values({
      deliveryRequestId:
        delivery.id,

      status: "open",

      updatedBy:
        data.userId,

      notes:
        "Delivery created",
    });

  return {
    ...delivery,
    trackingUrl,
  };
};