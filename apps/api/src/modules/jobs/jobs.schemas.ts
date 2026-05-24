import { z } from "zod";

const geoPointSchema = z.object({
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
});

export const createJobSchema = z.object({
  categoryId: z.string().uuid(),
  subcategory: z.string().min(1).max(80).optional(),
  title: z.string().min(5).max(120),
  description: z.string().min(20).max(2000),
  urgency: z.enum(["LOW", "NORMAL", "HIGH", "EMERGENCY"]).default("NORMAL"),
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  address: z.string().min(3).max(300),
  city: z.string().min(1).max(100),
  budgetMin: z.coerce.number().positive().optional(),
  budgetMax: z.coerce.number().positive().optional(),
  currency: z.literal("MAD").default("MAD"),
  scheduledAt: z.string().datetime().optional(),
  photos: z.array(z.string().url()).max(5).optional(),
});

export const myJobsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  status: z
    .enum(["PENDING", "ACTIVE", "IN_PROGRESS", "COMPLETED", "CANCELLED", "EXPIRED"])
    .optional(),
});

export const activeJobsQuerySchema = z.object({
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export const createOfferSchema = z.object({
  price: z.coerce.number().positive("Prix invalide"),
  eta_minutes: z.coerce.number().int().positive().max(24 * 60),
  message: z.string().max(500).optional(),
  currency: z.literal("MAD").default("MAD"),
});

export type CreateJobInput = z.infer<typeof createJobSchema>;
export type MyJobsQueryInput = z.infer<typeof myJobsQuerySchema>;
export type ActiveJobsQueryInput = z.infer<typeof activeJobsQuerySchema>;
export type CreateOfferInput = z.infer<typeof createOfferSchema>;
