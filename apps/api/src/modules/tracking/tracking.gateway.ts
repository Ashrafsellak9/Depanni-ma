import type { Namespace, Socket } from "socket.io";

import { getMapsClient } from "../../config/maps.js";
import { logger } from "../../utils/logger.js";
import { missionRoom } from "../../socket/socketAuth.js";
import { trackingService } from "./tracking.service.js";
import { trackingStartedSchema, trackingUpdateSchema } from "./tracking.schemas.js";

export function registerTrackingGateway(trackingNs: Namespace): void {
  trackingNs.on("connection", (socket: Socket) => {
    const userId = socket.data.userId as string;
    const artisanId = socket.data.artisanId as string | undefined;
    logger.info("Tracking socket connected", { userId, socketId: socket.id });

    socket.on("tracking:join", async (payload: { missionId: string }) => {
      try {
        await trackingService.assertMissionTrackingAccess(
          payload.missionId,
          userId,
          socket.data.role as string,
        );
        await socket.join(missionRoom(payload.missionId));
      } catch (err) {
        socket.emit("tracking:error", { message: String(err) });
      }
    });

    socket.on("tracking:started", async (payload: unknown) => {
      try {
        const { missionId } = trackingStartedSchema.parse(payload);
        await trackingService.markTrackingStarted(missionId, userId);
        trackingNs.to(missionRoom(missionId)).emit("tracking:started", {
          missionId,
          artisanId,
          startedAt: new Date().toISOString(),
        });
      } catch (err) {
        socket.emit("tracking:error", { message: String(err) });
      }
    });

    socket.on("tracking:update", async (payload: unknown) => {
      try {
        const data = trackingUpdateSchema.parse(payload);
        const { position, broadcasted, arrived } = await trackingService.updateMissionPosition(
          userId,
          artisanId,
          data,
        );

        let eta: { durationMinutes: number; distanceKm: number } | null = null;
        if (broadcasted && getMapsClient()) {
          const access = await trackingService.assertMissionTrackingAccess(
            data.missionId,
            userId,
            "ARTISAN",
          );
          try {
            eta = await trackingService.getEta(
              { lat: position.lat, lng: position.lng },
              { lat: access.job.lat, lng: access.job.lng },
            );
          } catch {
            eta = null;
          }
        }

        if (broadcasted) {
          trackingNs.to(missionRoom(data.missionId)).emit("tracking:position", {
            ...position,
            eta,
          });
        }

        if (arrived) {
          trackingNs.to(missionRoom(data.missionId)).emit("tracking:arrived", {
            missionId: data.missionId,
            artisanId: position.artisanId,
            lat: position.lat,
            lng: position.lng,
            arrivedAt: new Date().toISOString(),
          });
        }
      } catch (err) {
        socket.emit("tracking:error", { message: String(err) });
      }
    });

    socket.on("disconnect", () => {
      logger.debug("Tracking socket disconnected", { userId });
    });
  });
}
