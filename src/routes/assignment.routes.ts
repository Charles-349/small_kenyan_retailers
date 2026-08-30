import { Router } from "express";

import {
  authenticate,
} from "../middleware/auth.middleware";

import {
  assignDeliveryController,
  autoAssignDeliveryController,
} from "../controllers/assignment.controller";

const router = Router();

router.post(
  "/deliveries/:id/assign",
  authenticate,
  assignDeliveryController
);

router.post(
  "/deliveries/:id/auto-assign",
  authenticate,
  autoAssignDeliveryController
);

export default router;