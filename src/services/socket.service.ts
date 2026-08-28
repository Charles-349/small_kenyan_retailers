import { Server, Socket } from "socket.io";
import { db } from "../db";
import { riderLocations } from "../db/schema";
import { sql } from "drizzle-orm";

export function initializeSocketHandlers(io: Server) {
  io.on("connection", (socket: Socket) => {
    socket.on("rider:join", (riderId: number) => {
      socket.join(`rider_${riderId}`);
    });

    socket.on("delivery:track", (trackingToken: string) => {
      socket.join(`track_${trackingToken}`);
    });

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
          await db
            .insert(riderLocations)
            .values({
              riderId,
              latitude,
              longitude,
              heading: heading || null,
              speed: speed || null,
            })
            .onConflictDoUpdate({
              target: riderLocations.riderId,
              set: {
                latitude,
                longitude,
                heading: heading || null,
                speed: speed || null,
                updatedAt: sql`NOW()`,
              },
            });
        } catch (error) {
          console.error("Warning logging rider location to DB:", error);
        }

        if (trackingToken) {
          io.to(`track_${trackingToken}`).emit("delivery:location:update", {
            latitude,
            longitude,
            heading: heading || "0",
            speed: speed || "0",
            timestamp: new Date().toISOString(),
          });
        }
      }
    );

    socket.on("disconnect", () => {});
  });
}