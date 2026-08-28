import { Router } from "express";

import {
  authenticate,
} from "../middleware/auth.middleware";

import {
  updateRiderLocationController,
} from "../controllers/rider-location.controller";

const router = Router();

router.patch(
  "/location",
  authenticate,
  updateRiderLocationController
);

export default router;