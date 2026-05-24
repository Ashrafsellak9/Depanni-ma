import { getRedis } from "../../config/redis.js";

export interface ChatMessagePayload {
  roomId: string;
  senderId: string;
  content: string;
  type: "TEXT" | "IMAGE" | "LOCATION" | "SYSTEM";
  createdAt: string;
}

export class ChatService {
  private roomKey(roomId: string): string {
    return `chat:room:${roomId}:messages`;
  }

  async saveMessage(message: ChatMessagePayload): Promise<ChatMessagePayload> {
    await getRedis().lpush(this.roomKey(message.roomId), JSON.stringify(message));
    await getRedis().ltrim(this.roomKey(message.roomId), 0, 199);
    return message;
  }

  async getRecentMessages(roomId: string, limit = 50): Promise<ChatMessagePayload[]> {
    const raw = await getRedis().lrange(this.roomKey(roomId), 0, limit - 1);
    return raw
      .map((item: string) => JSON.parse(item) as ChatMessagePayload)
      .reverse();
  }
}

export const chatService = new ChatService();
