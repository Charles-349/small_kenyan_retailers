import { Router } from "express";

import {
  authenticate,
} from "../middleware/auth.middleware";

import {
  getRetailerDeliveriesController,
  getRetailerDeliveriesByStatusController,
} from "../controllers/retailer-delivery.controller";

const router = Router();

router.get(
  "/deliveries",
  authenticate,
  getRetailerDeliveriesController
);

router.get(
  "/deliveries/status/:status",
  authenticate,
  getRetailerDeliveriesByStatusController
);

export default router;