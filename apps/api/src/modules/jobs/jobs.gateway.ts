import type { Server, Socket } from "socket.io";

import { getRedis } from "../../config/redis.js";
import { logger } from "../../utils/logger.js";
import { artisanRoom, userRoom } from "../../socket/socketAuth.js";
import { emitJobEventLocally, JOBS_REDIS_CHANNEL, type JobEventPayload } from "./jobs.events.js";

let subscriberInitialized = false;

/** Redis pub/sub → broadcast Socket.io sur tous les nœuds API. */
export function initJobsRedisSubscriber(_io: Server): void {
  if (subscriberInitialized) return;
  subscriberInitialized = true;

  const subClient = getRedis().duplicate();
  void subClient.subscribe(JOBS_REDIS_CHANNEL);
  subClient.on("message", (channel, message) => {
    if (channel !== JOBS_REDIS_CHANNEL) return;
    try {
      const payload = JSON.parse(message) as JobEventPayload;
      emitJobEventLocally(payload);
    } catch (err) {
      logger.error("Invalid job event from Redis", { err: String(err) });
    }
  });

  logger.info("Jobs Redis pub/sub subscriber active");
}

/** Handlers Socket.io par connexion (appelé depuis chat.gateway). */
export function registerJobsSocketHandlers(socket: Socket, userId: string, role: string): void {
  void socket.join(userRoom(userId));

  const artisanId = socket.data.artisanId as string | undefined;
  if (role === "ARTISAN" && artisanId) {
    void socket.join(artisanRoom(artisanId));
  }

  socket.on("jobs:join", (payload: { artisanId?: string }) => {
    if (role !== "ARTISAN") return;
    const id = payload.artisanId ?? artisanId;
    if (id) void socket.join(artisanRoom(id));
  });

  socket.on("jobs:subscribe", (payload: { city?: string; categoryIds?: string[] }) => {
    if (role !== "ARTISAN") return;
    if (payload.city) {
      void socket.join(`city:${payload.city.toLowerCase().trim()}`);
    }
    for (const categoryId of payload.categoryIds ?? []) {
      void socket.join(`category:${categoryId}`);
    }
  });

  socket.on("jobs:unsubscribe", (payload: { city?: string; categoryIds?: string[] }) => {
    if (payload.city) {
      void socket.leave(`city:${payload.city.toLowerCase().trim()}`);
    }
    for (const categoryId of payload.categoryIds ?? []) {
      void socket.leave(`category:${categoryId}`);
    }
  });
}
