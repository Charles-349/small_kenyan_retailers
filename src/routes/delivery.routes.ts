import {
  Router,
} from "express";

import {
  createDeliveryController,
} from "../controllers/delivery.controller";

import {
  authenticate,
} from "../middleware/auth.middleware";

import {
  authorize,
} from "../middleware/role.middleware";

const router = Router();

router.post(
  "/",
  authenticate,
  authorize("retailer"),
  createDeliveryController
);

export default router;