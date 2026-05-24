import { z } from "zod";

const geoPointSchema = z.object({
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
});

export const updateUserMeSchema = z.object({
  firstName: z.string().min(2).max(50).optional(),
  lastName: z.string().min(2).max(50).optional(),
  bio: z.string().max(500).optional(),
  avatarUrl: z.string().url().optional(),
  locale: z.enum(["fr", "ar", "en"]).optional(),
});

export const createAddressSchema = z.object({
  label: z.enum(["HOME", "OFFICE", "OTHER"]).default("HOME"),
  street: z.string().max(200).optional(),
  city: z.string().min(1).max(100),
  region: z.string().max(100).optional(),
  postalCode: z.string().max(20).optional(),
  country: z.string().default("MA"),
  formatted: z.string().min(3).max(300),
  coordinates: geoPointSchema,
  isDefault: z.boolean().optional(),
});

export const historyQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  status: z.string().optional(),
});

export type UpdateUserMeInput = z.infer<typeof updateUserMeSchema>;
export type CreateAddressInput = z.infer<typeof createAddressSchema>;
export type HistoryQueryInput = z.infer<typeof historyQuerySchema>;

export const pushTokenSchema = z.object({
  token: z.string().min(10).max(512),
  platform: z.enum(["ios", "android", "web"]).optional(),
});

export type PushTokenInput = z.infer<typeof pushTokenSchema>;
