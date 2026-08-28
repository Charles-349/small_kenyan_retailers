import "dotenv/config";

import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.route";
import deliveryRoutes from "./routes/delivery.routes";
import assignmentRoutes
from "./routes/assignment.routes";

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

const PORT =
  process.env.PORT;

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});