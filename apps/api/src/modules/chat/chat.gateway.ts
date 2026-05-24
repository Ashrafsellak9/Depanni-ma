import type { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";

import type { JwtPayload } from "@depanni/types";

import { env } from "../../config/env.js";
import { chatService } from "./chat.service.js";
import { logger } from "../../utils/logger.js";

interface SocketAuthPayload extends JwtPayload {
  email: string;
}

export function registerChatGateway(io: Server): void {
  io.use((socket, next) => {
    const token = socket.handshake.auth.token as string | undefined;
    if (!token) {
      next(new Error("Authentication required"));
      return;
    }
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as SocketAuthPayload;
      socket.data.userId = decoded.sub;
      socket.data.role = decoded.role;
      next();
    } catch {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket: Socket) => {
    const userId = socket.data.userId as string;
    logger.info("Socket connected", { userId, socketId: socket.id });

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
