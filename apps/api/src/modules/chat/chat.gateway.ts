import type { Server, Socket } from "socket.io";

import { verifyAccessToken } from "../../config/jwt.js";
import { registerJobsSocketHandlers } from "../jobs/jobs.gateway.js";
import { chatService } from "./chat.service.js";
import { logger } from "../../utils/logger.js";

export function registerChatGateway(io: Server): void {
  io.use((socket, next) => {
    const token = socket.handshake.auth.token as string | undefined;
    if (!token) {
      next(new Error("Authentication required"));
      return;
    }
    try {
      const decoded = verifyAccessToken(token);
      socket.data.userId = decoded.userId;
      socket.data.role = decoded.role;
      next();
    } catch {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket: Socket) => {
    const userId = socket.data.userId as string;
    const role = socket.data.role as string;
    logger.info("Socket connected", { userId, socketId: socket.id });

    registerJobsSocketHandlers(socket, userId, role);

    socket.on("room:join", (roomId: string) => {
      void socket.join(roomId);
    });

    socket.on("message:send", async (payload: { roomId: string; content: string }) => {
      const message = await chatService.saveMessage({
        roomId: payload.roomId,
        senderId: userId,
        content: payload.content,
        type: "TEXT",
        createdAt: new Date().toISOString(),
      });
      io.to(payload.roomId).emit("message:new", message);
    });

    socket.on("disconnect", () => {
      logger.info("Socket disconnected", { userId, socketId: socket.id });
    });
  });
}
