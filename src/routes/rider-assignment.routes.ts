import { Router } from "express";

import {
  authenticate,
} from "../middleware/auth.middleware";

import {
  acceptAssignmentController,
  rejectAssignmentController,
} from "../controllers/rider-assignment.controller";

const router = Router();

router.patch(
  "/:id/accept",
  authenticate,
  acceptAssignmentController
);

router.patch(
  "/:id/reject",
  authenticate,
  rejectAssignmentController
);

export default router;