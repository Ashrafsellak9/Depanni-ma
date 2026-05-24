import type { Message, MessageType, Prisma } from "@prisma/client";

import { prisma } from "../../config/db.js";
import { getRedis } from "../../config/redis.js";
import { getChatNamespace } from "../../socket/index.js";
import { missionRoom } from "../../socket/socketAuth.js";
import { processAndUploadImage, uploadPrivateFile } from "../../middleware/upload.js";
import { ForbiddenError, NotFoundError } from "../../utils/errors.js";
import { mapSenderProfile, senderUserSelect } from "../../utils/profile.js";
import { sendMessageSchema, messagesQuerySchema, type SendMessageInput } from "./chat.schemas.js";

const RETENTION_MONTHS = 12;

export interface MessageDto {
  id: string;
  missionId: string;
  senderId: string;
  type: MessageType;
  content: string | null;
  fileUrl: string | null;
  isRead: boolean;
  createdAt: string;
  sender?: { id: string; firstName: string; lastName: string; avatarUrl: string | null };
}

export class ChatService {
  private retentionCutoff(): Date {
    const d = new Date();
    d.setMonth(d.getMonth() - RETENTION_MONTHS);
    return d;
  }

  private unreadKey(missionId: string, userId: string): string {
    return `chat:unread:${missionId}:${userId}`;
  }

  async assertMissionAccess(missionId: string, userId: string, role: string): Promise<{
    mission: { id: string; jobId: string; status: string };
    citizenUserId: string;
    artisanUserId: string | null;
  }> {
    const mission = await prisma.mission.findUnique({
      where: { id: missionId },
      include: {
        job: { select: { status: true } },
        citizen: { select: { userId: true } },
        artisan: { select: { userId: true } },
      },
    });
    if (!mission) throw new NotFoundError("Mission");

    const isCitizen = mission.citizen.userId === userId;
    const isArtisan = mission.artisan.userId === userId;

    if (!isCitizen && !isArtisan && role !== "ADMIN") {
      throw new ForbiddenError("Accès conversation refusé");
    }

    const jobStatus = mission.job.status;
    if (!["ACTIVE", "IN_PROGRESS", "COMPLETED"].includes(jobStatus) && role !== "ADMIN") {
      throw new ForbiddenError("Chat disponible après acceptation de l'offre");
    }

    return {
      mission: { id: mission.id, jobId: mission.jobId, status: mission.status },
      citizenUserId: mission.citizen.userId,
      artisanUserId: mission.artisan.userId,
    };
  }

  /** missionId = id Mission (ou jobId résolu vers mission). */
  async resolveMissionId(missionOrJobId: string): Promise<string> {
    const byId = await prisma.mission.findUnique({ where: { id: missionOrJobId } });
    if (byId) return byId.id;
    const byJob = await prisma.mission.findUnique({ where: { jobId: missionOrJobId } });
    if (byJob) return byJob.id;
    throw new NotFoundError("Mission");
  }

  async getParticipantIds(missionId: string): Promise<string[]> {
    const mission = await prisma.mission.findUnique({
      where: { id: missionId },
      include: {
        citizen: { select: { userId: true } },
        artisan: { select: { userId: true } },
      },
    });
    if (!mission) return [];
    return [mission.citizen.userId, mission.artisan.userId];
  }

  toDto(
    message: Message & {
      sender?: { id: string; firstName: string; lastName: string; avatarUrl: string | null };
    },
    missionId: string,
  ): MessageDto {
    return {
      id: message.id,
      missionId,
      senderId: message.senderId,
      type: message.type,
      content: message.content,
      fileUrl: message.fileUrl,
      isRead: message.isRead,
      createdAt: message.createdAt.toISOString(),
      sender: message.sender,
    };
  }

  async sendMessage(
    missionOrJobId: string,
    senderId: string,
    role: string,
    input: unknown,
    mediaFile?: Express.Multer.File,
  ): Promise<MessageDto> {
    const missionId = await this.resolveMissionId(missionOrJobId);
    await this.assertMissionAccess(missionId, senderId, role);
    const data: SendMessageInput = sendMessageSchema.parse(input);

    let fileUrl = data.mediaUrl;
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
        fileUrl = uploaded.url;
      } else {
        const uploaded = await processAndUploadImage(mediaFile.buffer, `chat/${missionId}`);
        fileUrl = uploaded.url;
      }
    }

    let type = data.type ?? "TEXT";
    if (mediaFile) {
      type = mediaFile.mimetype.startsWith("audio/") ? "AUDIO" : "IMAGE";
    } else if (fileUrl && type === "TEXT") {
      type = "IMAGE";
    }

    const message = await prisma.message.create({
      data: {
        missionId,
        senderId,
        type: type as MessageType,
        content: data.content,
        fileUrl,
      },
      include: {
        sender: { select: senderUserSelect },
      },
    });

    const participants = await this.getParticipantIds(missionId);
    const redis = getRedis();
    for (const userId of participants) {
      if (userId !== senderId) {
        await redis.incr(this.unreadKey(missionId, userId));
      }
    }

    const sender = mapSenderProfile(message.sender);
    const dto = this.toDto({ ...message, sender }, missionId);

    try {
      getChatNamespace().to(missionRoom(missionId)).emit("chat:message:received", dto);
    } catch {
      /* socket non prêt */
    }

    return dto;
  }

  async getMessages(missionOrJobId: string, userId: string, role: string, query: unknown) {
    const missionId = await this.resolveMissionId(missionOrJobId);
    await this.assertMissionAccess(missionId, userId, role);
    const { cursor, limit } = messagesQuerySchema.parse(query);
    const cutoff = this.retentionCutoff();

    const cursorMessage = cursor
      ? await prisma.message.findFirst({ where: { id: cursor, missionId } })
      : null;

    const messages = await prisma.message.findMany({
      where: {
        missionId,
        deletedAt: null,
        createdAt: {
          gte: cutoff,
          ...(cursorMessage ? { lt: cursorMessage.createdAt } : {}),
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit + 1,
      include: {
        sender: { select: senderUserSelect },
      },
    });

    const hasMore = messages.length > limit;
    const items = hasMore ? messages.slice(0, limit) : messages;
    const nextCursor = hasMore ? items[items.length - 1]?.id : null;

    const unread = await getRedis().get(this.unreadKey(missionId, userId));

    return {
      items: items.reverse().map((m) => this.toDto({ ...m, sender: mapSenderProfile(m.sender) }, missionId)),
      nextCursor,
      hasMore,
      unreadCount: Number(unread ?? 0),
    };
  }

  async listConversations(userId: string) {
    const cutoff = this.retentionCutoff();

    const missions = await prisma.mission.findMany({
      where: {
        OR: [{ citizen: { userId } }, { artisan: { userId } }],
        job: { status: { in: ["ACTIVE", "IN_PROGRESS", "COMPLETED"] } },
      },
      include: {
        job: { select: { id: true, title: true, status: true, updatedAt: true } },
        citizen: { select: { id: true, userId: true, firstName: true, lastName: true, avatar: true } },
        artisan: { select: { id: true, userId: true, firstName: true, lastName: true, avatar: true } },
        messages: {
          where: { deletedAt: null, createdAt: { gte: cutoff } },
          orderBy: { createdAt: "desc" },
          take: 1,
          include: { sender: { select: senderUserSelect } },
        },
      },
      orderBy: { updatedAt: "desc" },
      take: 50,
    });

    const redis = getRedis();
    const result = await Promise.all(
      missions.map(async (mission) => {
        const lastMessage = mission.messages[0];
        const unread = Number((await redis.get(this.unreadKey(mission.id, userId))) ?? 0);

        const peer =
          mission.citizen.userId === userId
            ? {
                id: mission.artisan.userId,
                firstName: mission.artisan.firstName,
                lastName: mission.artisan.lastName,
                avatarUrl: mission.artisan.avatar,
              }
            : {
                id: mission.citizen.userId,
                firstName: mission.citizen.firstName,
                lastName: mission.citizen.lastName,
                avatarUrl: mission.citizen.avatar,
              };

        return {
          missionId: mission.id,
          jobId: mission.jobId,
          title: mission.job.title,
          status: mission.job.status,
          peer,
          lastMessage: lastMessage
            ? {
                id: lastMessage.id,
                type: lastMessage.type,
                content: lastMessage.content,
                createdAt: lastMessage.createdAt.toISOString(),
                sender: mapSenderProfile(lastMessage.sender),
              }
            : null,
          unreadCount: unread,
          updatedAt: mission.updatedAt.toISOString(),
        };
      }),
    );

    return result;
  }

  async markRead(
    missionOrJobId: string,
    userId: string,
    role: string,
    messageIds: string[],
  ): Promise<void> {
    const missionId = await this.resolveMissionId(missionOrJobId);
    await this.assertMissionAccess(missionId, userId, role);

    await prisma.message.updateMany({
      where: {
        id: { in: messageIds },
        missionId,
        senderId: { not: userId },
        isRead: false,
      },
      data: { isRead: true },
    });

    await getRedis().set(this.unreadKey(missionId, userId), "0");
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
