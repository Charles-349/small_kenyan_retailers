import { Router } from "express";

import {
  authenticate,
} from "../middleware/auth.middleware";

import {
    getAssignedDeliveriesController,
  getOpenDeliveriesController,
} from "../controllers/dispatcher-delivery.controller";

const router = Router();

router.get(
  "/open",
  authenticate,
  getOpenDeliveriesController
);

router.get(
  "/assigned",
  authenticate,
  getAssignedDeliveriesController
);

export default router;