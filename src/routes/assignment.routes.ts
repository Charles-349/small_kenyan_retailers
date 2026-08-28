import { Router } from "express";
import { AssignmentService } from "../services/assignment.service";
import { AnalyticsService } from "../services/analytics.service";

const router = Router();

// Auto-dispatch nearest rider to open delivery
router.post("/deliveries/:id/auto-assign", async (req, res) => {
  try {
    const deliveryRequestId = parseInt(req.params.id);
    const dispatcherId = req.body.dispatcherId || 1;
    const io = (req as any).io;

    const result = await AssignmentService.autoAssignNearestRider(
      deliveryRequestId,
      dispatcherId,
      io
    );

    if (!result.success) {
      return res.status(404).json(result);
    }

    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Analytics: Fleet & delivery performance overview
router.get("/analytics/logistics", async (_req, res) => {
  try {
    const data = await AnalyticsService.getLogisticsOverview();
    return res.status(200).json({ success: true, data });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Analytics: Specific rider metrics
router.get("/analytics/riders/:id", async (req, res) => {
  try {
    const riderId = parseInt(req.params.id);
    const data = await AnalyticsService.getRiderPerformance(riderId);
    return res.status(200).json({ success: true, data });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

export default router;