import { Router } from "express";

import {
  authenticate,
} from "../middleware/auth.middleware";

import {
  getProofOfDeliveryController,
} from "../controllers/proof-of-delivery.controller";

const router = Router();

router.get(
  "/:id/proof",
  authenticate,
  getProofOfDeliveryController
);

export default router;