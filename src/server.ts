import "dotenv/config";
import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import authRoutes from "./routes/auth.route";
import deliveryRoutes from "./routes/delivery.routes";
import assignmentRoutes from "./routes/assignment.routes";
import { initializeSocketHandlers } from "./services/socket.service";

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
});