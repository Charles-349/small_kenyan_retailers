import { Router } from "express";

import {
  authenticate,
} from "../middleware/auth.middleware";

import {
  verifyDeliveryController,
} from "../controllers/qr-verification.controller";

const router = Router();

router.post(
  "/:id/verify-delivery",
  authenticate,
  verifyDeliveryController
);

export default router;