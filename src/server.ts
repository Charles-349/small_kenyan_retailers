import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "socket.io";

import { initializeSocketHandlers } from "./services/socket.service";
import analyticsRouter from "./routes/analytics.routes";
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

dotenv.config();

const app = express();
const server = http.createServer(app);

// Initialize Socket.io
export const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

initializeSocketHandlers(io);

// Middlewares
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/analytics", analyticsRouter);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/tracking", trackingRoutes);
app.use("/api/rider-assignments", riderAssignmentRoutes);
app.use("/api/delivery-status", deliveryStatusRoutes);
app.use("/api/qr-verification", qrVerificationRoutes);
app.use("/api/rider-deliveries", riderDeliveryRoutes);
app.use("/api/dispatcher-deliveries", dispatcherDeliveryRoutes);
app.use("/api/rider-locations", riderLocationRoutes);
app.use("/api/proof-of-delivery", proofOfDeliveryRoutes);
app.use("/api/retailer-deliveries", retailerDeliveryRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server and WebSockets operational" });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server and WebSockets running on port ${PORT}`);
});

export default app;