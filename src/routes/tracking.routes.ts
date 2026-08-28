import { Router } from "express";

import {
  getTrackingInfo,
} from "../controllers/tracking.controller";

const router = Router();

router.get(
  "/:token",
  getTrackingInfo
);

export default router;