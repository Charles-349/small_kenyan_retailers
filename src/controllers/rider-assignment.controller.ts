import {
  Request,
  Response,
} from "express";

import {
  acceptAssignment,
  rejectAssignment,
} from "../services/rider-assignment.service";

export const acceptAssignmentController =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const assignment =
        await acceptAssignment(
          Number(req.params.id),
          req.user!.id
        );

      return res.json({
        success: true,
        data: assignment,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Accept failed",
      });
    }
  };

export const rejectAssignmentController =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const assignment =
        await rejectAssignment(
          Number(req.params.id),
          req.user!.id
        );

      return res.json({
        success: true,
        data: assignment,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Reject failed",
      });
    }
  };