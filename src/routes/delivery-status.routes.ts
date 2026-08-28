import { Router } from "express";

import {
  authenticate,
} from "../middleware/auth.middleware";

import {
  markPickedUpController,
  markInTransitController,
} from "../controllers/delivery-status.controller";

const router = Router();

router.patch(
  "/:id/pick-up",
  authenticate,
  markPickedUpController
);

router.patch(
  "/:id/in-transit",
  authenticate,
  markInTransitController
);

export default router;