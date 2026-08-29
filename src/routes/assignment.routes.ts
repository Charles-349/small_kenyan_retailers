import { Router } from "express";
import { assignDelivery, autoAssignNearestRider } from "../services/assignment.service";
import { io } from "../server";

const router = Router();

router.post("/assign", async (req, res) => {
  try {
    const { deliveryRequestId, riderId, dispatcherId } = req.body;
    const result = await assignDelivery(
      Number(deliveryRequestId),
      Number(riderId),
      Number(dispatcherId),
      io
    );

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

router.post("/auto-assign", async (req, res) => {
  try {
    const { deliveryRequestId, dispatcherId } = req.body;
    const result = await autoAssignNearestRider(
      Number(deliveryRequestId),
      Number(dispatcherId),
      io
    );

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

export default router;