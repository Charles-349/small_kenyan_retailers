import {
  Request,
  Response,
} from "express";

import {
    getAssignedDeliveries,
  getOpenDeliveries,
} from "../services/dispatcher-delivery.service";

export const getOpenDeliveriesController =
  async (
    _req: Request,
    res: Response
  ) => {
    try {
      const deliveries =
        await getOpenDeliveries();

      return res.json({
        success: true,
        data: deliveries,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch deliveries",
      });
    }
  };

  export const getAssignedDeliveriesController =
  async (
    _req: Request,
    res: Response
  ) => {
    try {
      const deliveries =
        await getAssignedDeliveries();

      return res.json({
        success: true,
        data: deliveries,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch deliveries",
      });
    }
  };