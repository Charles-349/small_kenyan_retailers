import {
  Request,
  Response,
} from "express";

import {
  assignDelivery,
} from "../services/assignment.service";

export const assignDeliveryController =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const result =
        await assignDelivery(
          req.user!.id,
          Number(req.params.id),
          req.body.riderId
        );

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Assignment failed",
      });
    }
  };