import {
  Request,
  Response,
} from "express";

import {
  updateDeliveryStatus,
} from "../services/delivery-status.service";

export const markPickedUpController =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const delivery =
        await updateDeliveryStatus(
          Number(req.params.id),
          req.user!.id,
          "picked_up"
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
            : "Update failed",
      });
    }
  };

export const markInTransitController =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const delivery =
        await updateDeliveryStatus(
          Number(req.params.id),
          req.user!.id,
          "in_transit"
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
            : "Update failed",
      });
    }
  };