import { z } from "zod";

export const sendMessageSchema = z.object({
  type: z.enum(["TEXT", "IMAGE", "AUDIO", "TEMPLATE", "LOCATION", "SYSTEM"]).default("TEXT"),
  content: z.string().max(5000).optional(),
  mediaUrl: z.string().url().optional(),
  templateId: z.string().max(100).optional(),
  metadata: z.record(z.unknown()).optional(),
});

export const messagesQuerySchema = z.object({
  cursor: z.string().uuid().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(30),
});

export const socketMessageSchema = sendMessageSchema.extend({
  missionId: z.string().uuid(),
});

export const markReadSchema = z.object({
  missionId: z.string().uuid(),
  messageIds: z.array(z.string().uuid()).min(1).max(100),
});

export type SendMessageInput = z.infer<typeof sendMessageSchema>;
export type MessagesQueryInput = z.infer<typeof messagesQuerySchema>;
