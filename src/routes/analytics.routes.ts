import { Router } from "express";
import { AnalyticsService } from "../services/analytics.service";

const router = Router();

router.get("/logistics", async (req, res) => {
  try {
    const result = await AnalyticsService.getLogisticsOverview();
    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

router.get("/riders/:id", async (req, res) => {
  try {
    const riderId = Number(req.params.id);
    const result = await AnalyticsService.getRiderPerformance(riderId);
    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

export default router;