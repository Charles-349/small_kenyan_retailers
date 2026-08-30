import { Request, Response } from "express";
import { eq } from "drizzle-orm";

import { db } from "../db";

import { dispatchers } from "../db/schema";

import {
  assignDelivery,
  autoAssignNearestRider,
} from "../services/assignment.service";

export const assignDeliveryController = async (
  req: Request,
  res: Response
) => {
  try {
    const dispatcher =
      await db.query.dispatchers.findFirst({
        where: eq(
          dispatchers.userId,
          req.user!.id
        ),
      });

    if (!dispatcher) {
      return res.status(404).json({
        success: false,
        message: "Dispatcher not found",
      });
    }

    const result =
      await assignDelivery(
        Number(req.params.id), // deliveryRequestId
        req.body.riderId,      // riderId
        dispatcher.id          // dispatcherId
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

export const autoAssignDeliveryController =
  async (
    req: Request,
    res: Response
  ) => {
    try {

      const dispatcher =
        await db.query.dispatchers.findFirst({
          where: eq(
            dispatchers.userId,
            req.user!.id
          ),
        });

      if (!dispatcher) {
        return res.status(404).json({
          success: false,
          message: "Dispatcher not found",
        });
      }

      const result =
        await autoAssignNearestRider(
          Number(req.params.id),
          dispatcher.id
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
            : "Auto assignment failed",
      });
    }
  };