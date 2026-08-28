import {
  Request,
  Response,
} from "express";

import {
  getRetailerDeliveries,
  getRetailerDeliveriesByStatus,
} from "../services/retailer-delivery.service";

export const getRetailerDeliveriesController =
  async (
    req: Request,
    res: Response
  ) => {
    try {

      const deliveries =
        await getRetailerDeliveries(
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

export const getRetailerDeliveriesByStatusController =
  async (
    req: Request,
    res: Response
  ) => {
    try {

      const deliveries =
        await getRetailerDeliveriesByStatus(
          req.user!.id,
          req.params.status as any
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