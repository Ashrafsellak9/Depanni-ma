import type { Message, MessageType, Prisma } from "@prisma/client";

import { prisma } from "../../config/db.js";
import { getRedis } from "../../config/redis.js";
import { getChatNamespace } from "../../socket/index.js";
import { missionRoom } from "../../socket/socketAuth.js";
import { processAndUploadImage, uploadPrivateFile } from "../../middleware/upload.js";
import { ForbiddenError, NotFoundError } from "../../utils/errors.js";
import { sendMessageSchema, messagesQuerySchema, type SendMessageInput } from "./chat.schemas.js";

const RETENTION_MONTHS = 12;

export interface MessageDto {
  id: string;
  conversationId: string;
  missionId: string;
  senderId: string;
  type: MessageType;
  content: string | null;
  mediaUrl: string | null;
  templateId: string | null;
  metadata: unknown;
  createdAt: string;
  sender?: { id: string; firstName: string; lastName: string; avatarUrl: string | null };
}

export class ChatService {
  private retentionCutoff(): Date {
    const d = new Date();
    d.setMonth(d.getMonth() - RETENTION_MONTHS);
    return d;
  }

  private unreadKey(conversationId: string, userId: string): string {
    return `chat:unread:${conversationId}:${userId}`;
  }

  async assertMissionAccess(missionId: string, userId: string, role: string): Promise<{
    job: { id: string; citizenId: string; status: string };
    artisanUserId: string | null;
  }> {
    const job = await prisma.job.findUnique({
      where: { id: missionId },
      include: {
        acceptedOffer: { include: { artisan: { select: { userId: true } } } },
      },
    });
    if (!job) throw new NotFoundError("Mission");

    const artisanUserId = job.acceptedOffer?.artisan.userId ?? null;
    const isCitizen = job.citizenId === userId;
    const isArtisan = artisanUserId === userId;

    if (!isCitizen && !isArtisan && role !== "ADMIN") {
      throw new ForbiddenError("Accès conversation refusé");
    }

    if (!["ACTIVE", "IN_PROGRESS", "COMPLETED"].includes(job.status) && role !== "ADMIN") {
      throw new ForbiddenError("Chat disponible après acceptation de l'offre");
    }

    return { job: { id: job.id, citizenId: job.citizenId, status: job.status }, artisanUserId };
  }

  async getOrCreateConversation(missionId: string): Promise<{ id: string; jobId: string }> {
    return prisma.conversation.upsert({
      where: { jobId: missionId },
      create: { jobId: missionId },
      update: {},
      select: { id: true, jobId: true },
    });
  }

  async getParticipantIds(missionId: string): Promise<string[]> {
    const job = await prisma.job.findUnique({
      where: { id: missionId },
      include: { acceptedOffer: { include: { artisan: { select: { userId: true } } } } },
    });
    if (!job) return [];
    const ids = [job.citizenId];
    if (job.acceptedOffer?.artisan.userId) ids.push(job.acceptedOffer.artisan.userId);
    return ids;
  }

  toDto(message: Message & { sender?: { id: string; firstName: string; lastName: string; avatarUrl: string | null } }, missionId: string): MessageDto {
    return {
      id: message.id,
      conversationId: message.conversationId,
      missionId,
      senderId: message.senderId,
      type: message.type,
      content: message.content,
      mediaUrl: message.mediaUrl,
      templateId: message.templateId,
      metadata: message.metadata,
      createdAt: message.createdAt.toISOString(),
      sender: message.sender,
    };
  }

  async sendMessage(
    missionId: string,
    senderId: string,
    role: string,
    input: unknown,
    mediaFile?: Express.Multer.File,
  ): Promise<MessageDto> {
    await this.assertMissionAccess(missionId, senderId, role);
    const data: SendMessageInput = sendMessageSchema.parse(input);
    const conversation = await this.getOrCreateConversation(missionId);

    let mediaUrl = data.mediaUrl;
    if (mediaFile) {
      const isAudio = mediaFile.mimetype.startsWith("audio/");
      if (isAudio) {
        const ext = mediaFile.mimetype.includes("mpeg") ? "mp3" : "m4a";
        const uploaded = await uploadPrivateFile(
          mediaFile.buffer,
          `chat/${missionId}`,
          mediaFile.mimetype,
          ext,
        );
        mediaUrl = uploaded.url;
      } else {
        const uploaded = await processAndUploadImage(mediaFile.buffer, `chat/${missionId}`);
        mediaUrl = uploaded.url;
      }
    }

    let type = data.type ?? "TEXT";
    if (mediaFile) {
      type = mediaFile.mimetype.startsWith("audio/") ? "AUDIO" : "IMAGE";
    } else if (mediaUrl && type === "TEXT") {
      type = "IMAGE";
    }

    const message = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        senderId,
        type: type as MessageType,
        content: data.content,
        mediaUrl,
        templateId: data.templateId,
        metadata: data.metadata as Prisma.InputJsonValue | undefined,
      },
      include: {
        sender: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } },
      },
    });

    await prisma.conversation.update({
      where: { id: conversation.id },
      data: { updatedAt: new Date() },
    });

    const participants = await this.getParticipantIds(missionId);
    const redis = getRedis();
    for (const userId of participants) {
      if (userId !== senderId) {
        await redis.incr(this.unreadKey(conversation.id, userId));
      }
    }

    const dto = this.toDto(message, missionId);

    try {
      getChatNamespace().to(missionRoom(missionId)).emit("chat:message:received", dto);
    } catch {
      /* socket non prêt */
    }

    return dto;
  }

  async getMessages(missionId: string, userId: string, role: string, query: unknown) {
    await this.assertMissionAccess(missionId, userId, role);
    const { cursor, limit } = messagesQuerySchema.parse(query);
    const conversation = await this.getOrCreateConversation(missionId);
    const cutoff = this.retentionCutoff();

    const cursorMessage = cursor
      ? await prisma.message.findFirst({ where: { id: cursor, conversationId: conversation.id } })
      : null;

    const messages = await prisma.message.findMany({
      where: {
        conversationId: conversation.id,
        deletedAt: null,
        createdAt: {
          gte: cutoff,
          ...(cursorMessage ? { lt: cursorMessage.createdAt } : {}),
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit + 1,
      include: {
        sender: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } },
      },
    });

    const hasMore = messages.length > limit;
    const items = hasMore ? messages.slice(0, limit) : messages;
    const nextCursor = hasMore ? items[items.length - 1]?.id : null;

    const unread = await getRedis().get(this.unreadKey(conversation.id, userId));

    return {
      items: items.reverse().map((m) => this.toDto(m, missionId)),
      nextCursor,
      hasMore,
      unreadCount: Number(unread ?? 0),
    };
  }

  async listConversations(userId: string) {
    const cutoff = this.retentionCutoff();

    const jobs = await prisma.job.findMany({
      where: {
        OR: [
          { citizenId: userId },
          { acceptedOffer: { artisan: { userId } } },
        ],
        status: { in: ["ACTIVE", "IN_PROGRESS", "COMPLETED"] },
        conversation: { isNot: null },
      },
      include: {
        conversation: {
          include: {
            messages: {
              where: { deletedAt: null, createdAt: { gte: cutoff } },
              orderBy: { createdAt: "desc" },
              take: 1,
              include: {
                sender: { select: { id: true, firstName: true, lastName: true } },
              },
            },
          },
        },
        acceptedOffer: {
          include: {
            artisan: {
              include: {
                user: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } },
              },
            },
          },
        },
        citizen: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } },
      },
      orderBy: { updatedAt: "desc" },
      take: 50,
    });

    const redis = getRedis();
    const result = await Promise.all(
      jobs.map(async (job) => {
        const conv = job.conversation;
        const lastMessage = conv?.messages[0];
        const unread = conv
          ? Number((await redis.get(this.unreadKey(conv.id, userId))) ?? 0)
          : 0;

        const peer =
          job.citizenId === userId
            ? job.acceptedOffer?.artisan.user
            : job.citizen;

        return {
          missionId: job.id,
          conversationId: conv?.id,
          title: job.title,
          status: job.status,
          peer,
          lastMessage: lastMessage
            ? {
                id: lastMessage.id,
                type: lastMessage.type,
                content: lastMessage.content,
                createdAt: lastMessage.createdAt.toISOString(),
                sender: lastMessage.sender,
              }
            : null,
          unreadCount: unread,
          updatedAt: conv?.updatedAt.toISOString() ?? job.updatedAt.toISOString(),
        };
      }),
    );

    return result;
  }

  async markRead(missionId: string, userId: string, role: string, messageIds: string[]): Promise<void> {
    await this.assertMissionAccess(missionId, userId, role);
    const conversation = await this.getOrCreateConversation(missionId);

    const messages = await prisma.message.findMany({
      where: {
        id: { in: messageIds },
        conversationId: conversation.id,
        deletedAt: null,
      },
    });

    if (messages.length === 0) return;

    await prisma.messageRead.createMany({
      data: messages.map((m) => ({ messageId: m.id, userId })),
      skipDuplicates: true,
    });

    await getRedis().set(this.unreadKey(conversation.id, userId), "0");
  }

  async softDeleteMessage(messageId: string, userId: string): Promise<void> {
    const message = await prisma.message.findUnique({ where: { id: messageId } });
    if (!message) throw new NotFoundError("Message");
    if (message.senderId !== userId) throw new ForbiddenError();
    await prisma.message.update({
      where: { id: messageId },
      data: { deletedAt: new Date() },
    });
  }
}

export const chatService = new ChatService();
