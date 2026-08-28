import {
  Request,
  Response,
} from "express";

import {
  getDeliveryByTrackingToken,
} from "../services/tracking.service";

type TrackingParams = {
  token: string;
};

export const getTrackingInfo =
  async (
    req: Request<TrackingParams>,
    res: Response
  ) => {
    try {
      const delivery =
        await getDeliveryByTrackingToken(
          req.params.token
        );

      return res.json({
        success: true,
        data: delivery,
      });
    } catch (error) {
      return res.status(404).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Tracking failed",
      });
    }
  };