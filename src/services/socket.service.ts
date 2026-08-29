import { Server, Socket } from "socket.io";
import { db } from "../db";
import { riderLocations } from "../db/schema";
import { sql } from "drizzle-orm";

export function initializeSocketHandlers(io: Server) {
  io.on("connection", (socket: Socket) => {
    socket.on("rider:join", (riderId: number | string) => {
      const id = Number(riderId);
      socket.join(`rider_${id}`);
    });

    socket.on("delivery:track", (trackingToken: string) => {
      if (trackingToken) {
        socket.join(`track_${trackingToken}`);
      }
    });

    socket.on(
      "rider:location:ping",
      async (data: {
        riderId: number | string;
        latitude: string | number;
        longitude: string | number;
        heading?: string | number;
        speed?: string | number;
        trackingToken?: string;
      }) => {
        const riderId = Number(data.riderId);
        const latitude = String(data.latitude);
        const longitude = String(data.longitude);
        const heading = data.heading !== undefined ? Number(data.heading) : null;
        const speed = data.speed !== undefined ? Number(data.speed) : null;

        try {
          await db
            .insert(riderLocations)
            .values({
              riderId,
              latitude,
              longitude,
              heading,
              speed,
            })
            .onConflictDoUpdate({
              target: riderLocations.riderId,
              set: {
                latitude,
                longitude,
                heading,
                speed,
                updatedAt: sql`NOW()`,
              },
            });
        } catch (error) {
          console.error("Warning logging rider location to DB:", error);
        }

        if (data.trackingToken) {
          io.to(`track_${data.trackingToken}`).emit("delivery:location:update", {
            latitude,
            longitude,
            heading: heading !== null ? String(heading) : "0",
            speed: speed !== null ? String(speed) : "0",
            timestamp: new Date().toISOString(),
          });
        }
      }
    );

    socket.on("disconnect", () => {});
  });
}