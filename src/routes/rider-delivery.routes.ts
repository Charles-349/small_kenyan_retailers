import { Router } from "express";

import {
  authenticate,
} from "../middleware/auth.middleware";

import {
  getMyDeliveriesController,
} from "../controllers/rider-delivery.controller";

const router = Router();

router.get(
  "/my-deliveries",
  authenticate,
  getMyDeliveriesController
);

export default router;