import {
  Request,
  Response,
} from "express";

import {
  updateRiderLocation,
} from "../services/rider-location.service";

export const updateRiderLocationController =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const location =
        await updateRiderLocation({
          riderUserId:
            req.user!.id,

          latitude:
            req.body.latitude,

          longitude:
            req.body.longitude,

          speed:
            req.body.speed,

          heading:
            req.body.heading,
        });

      return res.json({
        success: true,
        data: location,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to update location",
      });
    }
  };