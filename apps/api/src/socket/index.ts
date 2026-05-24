import { createAdapter } from "@socket.io/redis-adapter";
import type { Server as HttpServer } from "node:http";
import { Server, type Namespace } from "socket.io";

import { env, socketCorsOrigins } from "../config/env.js";
import { getRedis } from "../config/redis.js";
import { registerChatGateway } from "../modules/chat/chat.gateway.js";
import { initJobsRedisSubscriber, registerJobsSocketHandlers } from "../modules/jobs/jobs.gateway.js";
import { registerTrackingGateway } from "../modules/tracking/tracking.gateway.js";
import { applySocketAuth } from "./socketAuth.js";
import { logger } from "../utils/logger.js";

let io: Server | null = null;
let chatNs: Namespace | null = null;
let trackingNs: Namespace | null = null;

export async function initSocket(httpServer: HttpServer): Promise<Server> {
  const pubClient = getRedis();
  const subClient = pubClient.duplicate();

  io = new Server(httpServer, {
    path: env.SOCKET_PATH,
    cors: { origin: socketCorsOrigins, credentials: true },
  });

  io.adapter(createAdapter(pubClient, subClient));

  // Namespace racine — diffusion jobs + rooms user:*
  applySocketAuth(io);
  initJobsRedisSubscriber(io);
  io.on("connection", (socket) => {
    const userId = socket.data.userId as string;
    const role = socket.data.role as string;
    registerJobsSocketHandlers(socket, userId, role);
  });

  chatNs = io.of("/chat");
  trackingNs = io.of("/tracking");
  applySocketAuth(chatNs);
  applySocketAuth(trackingNs);
  registerChatGateway(chatNs);
  registerTrackingGateway(trackingNs);

  logger.info("Socket.io initialized", {
    path: env.SOCKET_PATH,
    namespaces: ["/", "/chat", "/tracking"],
  });

  return io;
}

export function getIO(): Server {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
}

export function getChatNamespace(): Namespace {
  if (!chatNs) {
    throw new Error("Chat namespace not initialized");
  }
  return chatNs;
}

export function getTrackingNamespace(): Namespace {
  if (!trackingNs) {
    throw new Error("Tracking namespace not initialized");
  }
  return trackingNs;
}

export async function closeSocket(): Promise<void> {
  if (io) {
    await new Promise<void>((resolve) => {
      io!.close(() => resolve());
    });
    io = null;
    chatNs = null;
    trackingNs = null;
    logger.info("Socket.io closed");
  }
}
