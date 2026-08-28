import "dotenv/config";

import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.route";
import deliveryRoutes from "./routes/delivery.routes";
import assignmentRoutes from "./routes/assignment.routes";
import trackingRoutes from "./routes/tracking.routes";
import riderAssignmentRoutes from "./routes/rider-assignment.routes";
import deliveryStatusRoutes from "./routes/delivery-status.routes";
import qrVerificationRoutes from "./routes/qr-verification.routes";
import riderDeliveryRoutes from "./routes/rider-delivery.routes";
import dispatcherDeliveryRoutes from "./routes/dispatcher-delivery.routes";
import riderLocationRoutes from "./routes/rider-location.routes";
import proofOfDeliveryRoutes from "./routes/proof-of-delivery.routes";
import retailerDeliveryRoutes from "./routes/retailer-delivery.routes";





const app = express();

app.use(cors());

app.use(express.json());

app.get("/health", (_, res) => {
  res.json({
    success: true,
    message: "API running",
  });
});

app.use("/api/auth", authRoutes);
app.use(
  "/api/deliveries",
  deliveryRoutes
);
app.use(
  "/api",
  assignmentRoutes
);

app.use(
  "/api/tracking",
  trackingRoutes
);
app.use(
  "/api/assignments",
  riderAssignmentRoutes
);
app.use(
  "/api/delivery-status",
  deliveryStatusRoutes
);
app.use(
  "/api/deliveries",
  qrVerificationRoutes
);
app.use(
  "/api/rider",
  riderDeliveryRoutes
);
app.use(
  "/api/deliveries",
  dispatcherDeliveryRoutes
);
app.use(
  "/api/rider",
  riderLocationRoutes
);
app.use(
  "/api/deliveries",
  proofOfDeliveryRoutes
);
app.use(
  "/api/retailer",
  retailerDeliveryRoutes
);


const PORT =
  process.env.PORT;

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});