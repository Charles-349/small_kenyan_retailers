import { Server, Socket } from "socket.io";
import { db } from "../db";
import { riderLocations } from "../db/schema";

export function initializeSocketHandlers(io: Server) {
  io.on("connection", (socket: Socket) => {
    // 1. Rider joins personal room for real-time dispatch alerts
    socket.on("rider:join", (riderId: number) => {
      socket.join(`rider_${riderId}`);
      console.log(`Rider ${riderId} connected to private channel.`);
    });

    // 2. Customer joins room for order tracking
    socket.on("delivery:track", (trackingToken: string) => {
      socket.join(`track_${trackingToken}`);
      console.log(`Client tracking delivery token: ${trackingToken}`);
    });

    // 3. Telemetry Sync: Rider pings live location
    socket.on(
      "rider:location:ping",
      async (data: {
        riderId: number;
        latitude: string;
        longitude: string;
        heading?: string;
        speed?: string;
        trackingToken?: string;
      }) => {
        const { riderId, latitude, longitude, heading, speed, trackingToken } = data;

        try {
          // Log coordinates to riderLocations table
          await db.insert(riderLocations).values({
            riderId,
            latitude,
            longitude,
            heading: heading || null,
            speed: speed || null,
          });

          // Sync live coordinates to customer tracking room
          if (trackingToken) {
            io.to(`track_${trackingToken}`).emit("delivery:location:update", {
              latitude,
              longitude,
              heading: heading || "0",
              timestamp: new Date().toISOString(),
            });
          }
        } catch (error) {
          console.error("Error processing rider location ping:", error);
        }
      }
    );

    socket.on("disconnect", () => {
      // Disconnected cleanly
    });
  });
}