import {
  Request,
  Response,
} from "express";

import {
  createDelivery,
} from "../services/delivery.service";

export const createDeliveryController =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const delivery =
        await createDelivery({
          userId:
            req.user!.id,

          customerName:
            req.body.customerName,

          customerPhone:
            req.body.customerPhone,

          deliveryAddress:
            req.body.deliveryAddress,

          itemDescription:
            req.body.itemDescription,

          specialInstructions:
            req.body
              .specialInstructions,

          latitude:
            req.body.latitude,

          longitude:
            req.body.longitude,
        });

      return res.status(201).json({
        success: true,
        data: delivery,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to create delivery",
      });
    }
  };