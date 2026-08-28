import {
  Request,
  Response,
} from "express";

import {
  getMyDeliveries,
} from "../services/rider-delivery.service";

export const getMyDeliveriesController =
  async (
    req: Request,
    res: Response
  ) => {
    try {

      const deliveries =
        await getMyDeliveries(
          req.user!.id
        );

      return res.json({
        success: true,
        data: deliveries,
      });

    } catch (error) {

      return res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch deliveries",
      });

    }
  };