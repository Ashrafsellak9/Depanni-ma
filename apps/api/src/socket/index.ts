import { createAdapter } from "@socket.io/redis-adapter";
import type { Server as HttpServer } from "node:http";
import { Server } from "socket.io";

import { env, socketCorsOrigins } from "../config/env.js";
import { getRedis } from "../config/redis.js";
import { registerChatGateway } from "../modules/chat/chat.gateway.js";
import { logger } from "../utils/logger.js";

let io: Server | null = null;

export async function initSocket(httpServer: HttpServer): Promise<Server> {
  const pubClient = getRedis();
  const subClient = pubClient.duplicate();

  io = new Server(httpServer, {
    path: env.SOCKET_PATH,
    cors: { origin: socketCorsOrigins, credentials: true },
  });

  io.adapter(createAdapter(pubClient, subClient));
  registerChatGateway(io);

  logger.info("Socket.io initialized", { path: env.SOCKET_PATH });
  return io;
}

export function getIO(): Server {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
}

export async function closeSocket(): Promise<void> {
  if (io) {
    await new Promise<void>((resolve) => {
      io!.close(() => resolve());
    });
    io = null;
    logger.info("Socket.io closed");
  }
}
