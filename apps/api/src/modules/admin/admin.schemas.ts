import { z } from "zod";

export const artisansListSchema = z.object({
  search: z.string().max(120).optional(),
  kyc: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
  specialty: z.string().max(80).optional(),
  city: z.string().max(80).optional(),
  ratingMin: z.coerce.number().min(0).max(5).optional(),
  subscription: z.enum(["STANDARD", "PREMIUM", "PRO"]).optional(),
  accountStatus: z.enum(["ACTIVE", "SUSPENDED", "BANNED"]).optional(),
  sortBy: z
    .enum(["createdAt", "rating", "totalMissions", "monthRevenue", "firstName"])
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(200).default(50),
});

export const rejectKycAdminSchema = z.object({
  reason: z.string().min(5).max(500),
  predefinedReason: z.string().max(120).optional(),
  sendEmail: z.boolean().default(true),
});

export const artisanActionSchema = z.object({
  note: z.string().max(500).optional(),
});

export const upgradeSubscriptionAdminSchema = z.object({
  tier: z.enum(["STANDARD", "PREMIUM", "PRO"]),
});

export const adminMessageSchema = z.object({
  content: z.string().min(1).max(2000),
});

export const resolveDisputeSchema = z.object({
  resolution: z.enum(["REFUND_CLIENT", "RELEASE_ARTISAN", "SPLIT"]),
  clientAmount: z.coerce.number().min(0).optional(),
  artisanAmount: z.coerce.number().min(0).optional(),
  note: z.string().max(500).optional(),
});

export type ArtisansListQuery = z.infer<typeof artisansListSchema>;
export type ResolveDisputeInput = z.infer<typeof resolveDisputeSchema>;
