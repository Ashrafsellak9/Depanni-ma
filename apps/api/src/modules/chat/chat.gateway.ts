import type { Namespace, Socket } from "socket.io";

import { logger } from "../../utils/logger.js";
import { missionRoom, userRoom } from "../../socket/socketAuth.js";
import { chatService } from "./chat.service.js";
import { markReadSchema, socketMessageSchema } from "./chat.schemas.js";

export function registerChatGateway(chatNs: Namespace): void {
  chatNs.on("connection", (socket: Socket) => {
    const userId = socket.data.userId as string;
    void socket.join(userRoom(userId));
    logger.info("Chat socket connected", { userId, socketId: socket.id });

    socket.on("chat:join", async (payload: { missionId: string }) => {
      try {
        await chatService.assertMissionAccess(payload.missionId, userId, socket.data.role as string);
        await chatService.getOrCreateConversation(payload.missionId);
        await socket.join(missionRoom(payload.missionId));
        socket.data.missionId = payload.missionId;
      } catch (err) {
        socket.emit("chat:error", { message: String(err) });
      }
    });

    socket.on("chat:message", async (payload: unknown) => {
      try {
        const data = socketMessageSchema.parse(payload);
        await chatService.sendMessage(
          data.missionId,
          userId,
          socket.data.role as string,
          data,
        );
      } catch (err) {
        socket.emit("chat:error", { message: String(err) });
      }
    });

    socket.on("chat:typing", (payload: { missionId: string; isTyping: boolean }) => {
      socket.to(missionRoom(payload.missionId)).emit("chat:typing", {
        missionId: payload.missionId,
        userId,
        isTyping: payload.isTyping,
      });
    });

    socket.on("chat:read", async (payload: unknown) => {
      try {
        const { missionId, messageIds } = markReadSchema.parse(payload);
        await chatService.markRead(missionId, userId, socket.data.role as string, messageIds);
        socket.to(missionRoom(missionId)).emit("chat:read", { missionId, userId, messageIds });
      } catch (err) {
        socket.emit("chat:error", { message: String(err) });
      }
    });

    socket.on("disconnect", () => {
      logger.debug("Chat socket disconnected", { userId });
    });
  });
}
