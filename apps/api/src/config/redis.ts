import { Redis } from "ioredis";

import { env } from "./env.js";
import { logger } from "../utils/logger.js";

let redisClient: Redis | null = null;

export function getRedis(): Redis {
  if (!redisClient) {
    redisClient = new Redis(env.REDIS_URL, {
      maxRetriesPerRequest: null,
      enableReadyCheck: true,
      retryStrategy(times: number): number | null {
        if (times > 10) {
          logger.error("Redis max reconnection attempts reached");
          return null;
        }
        return Math.min(times * 200, 3000);
      },
    });

    redisClient.on("connect", () => logger.info("Redis connected"));
    redisClient.on("error", (err: Error) => logger.error("Redis error", { err: err.message }));
    redisClient.on("reconnecting", () => logger.warn("Redis reconnecting"));
  }
  return redisClient;
}

export async function disconnectRedis(): Promise<void> {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
    logger.info("Redis disconnected");
  }
}
