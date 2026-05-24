import { getRedis } from "../../config/redis.js";
import { getIO } from "../../socket/index.js";
import { logger } from "../../utils/logger.js";

export const JOBS_REDIS_CHANNEL = "depanni:jobs:events";

export type JobSocketEvent =
  | "job:new"
  | "job:offer:new"
  | "job:status"
  | "job:expired";

export interface JobEventPayload {
  event: JobSocketEvent;
  rooms: string[];
  data: Record<string, unknown>;
}

/** Publie sur Redis pub/sub + émet localement (tous les nœuds via subscriber). */
export async function publishJobEvent(payload: JobEventPayload): Promise<void> {
  try {
    await getRedis().publish(JOBS_REDIS_CHANNEL, JSON.stringify(payload));
  } catch (err) {
    logger.error("Redis publish job event failed", { err: String(err) });
  }
  emitJobEventLocally(payload);
}

export function emitJobEventLocally(payload: JobEventPayload): void {
  try {
    const io = getIO();
    for (const room of payload.rooms) {
      io.to(room).emit(payload.event, payload.data);
    }
  } catch {
    logger.warn("Socket.io not ready — job event skipped", { event: payload.event });
  }
}

export function jobCityRoom(city: string): string {
  return `city:${city.toLowerCase().trim()}`;
}

export function jobCategoryRoom(categoryId: string): string {
  return `category:${categoryId}`;
}

export function citizenUserRoom(userId: string): string {
  return `user:${userId}`;
}
