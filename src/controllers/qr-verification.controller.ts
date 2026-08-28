import {
  Request,
  Response,
} from "express";

import {
  verifyDeliveryQr,
} from "../services/qr-verification.service";

export const verifyDeliveryController =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const delivery =
        await verifyDeliveryQr(
          Number(req.params.id),
          req.body.qrCode,
          req.user!.id,
          req.body.recipientName
        );

      return res.json({
        success: true,
        data: delivery,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Verification failed",
      });
    }
  };