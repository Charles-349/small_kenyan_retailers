import "dotenv/config";
import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import authRoutes from "./routes/auth.route";
import deliveryRoutes from "./routes/delivery.routes";
import assignmentRoutes from "./routes/assignment.routes";
import { initializeSocketHandlers } from "./services/socket.service";
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

// 1. Create HTTP server instance and wrap with Socket.io
const server = http.createServer(app);
export const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// 2. Initialize real-time location and telemetry handlers
initializeSocketHandlers(io);

// 3. Inject Socket.io instance into incoming Express requests
app.use((req, _res, next) => {
  (req as any).io = io;
  next();
});

// Health check endpoint
app.get("/health", (_, res) => {
  res.json({
    success: true,
    message: "API & WebSocket Server running",
  });
});

// Application Routes
app.use("/api/auth", authRoutes);
app.use("/api/deliveries", deliveryRoutes);
app.use("/api", assignmentRoutes);

const PORT = process.env.PORT || 5000;

// 4. Start HTTP + WebSocket Server
server.listen(PORT, () => {
  console.log(`Server and WebSockets running on port ${PORT}`);
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