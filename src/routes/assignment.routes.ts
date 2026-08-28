import {
  Router,
} from "express";

import {
  authenticate,
} from "../middleware/auth.middleware";

import {
  authorize,
} from "../middleware/role.middleware";

import {
  assignDeliveryController,
} from "../controllers/assignment.controller";

const router = Router();

router.post(
  "/deliveries/:id/assign",
  authenticate,
  authorize("dispatcher"),
  assignDeliveryController
);

export default router;