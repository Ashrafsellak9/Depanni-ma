import { z } from "zod";

// =============================================================================
// DEPANNI.ma — Schémas Zod partagés
// =============================================================================

const geoPointSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});

const geoAddressSchema = z.object({
  street: z.string().optional(),
  city: z.string().min(1),
  region: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().default("MA"),
  formatted: z.string().min(1),
  coordinates: geoPointSchema,
});

const phoneSchema = z
  .string()
  .regex(/^(\+212|0)[5-7]\d{8}$/, "Numéro de téléphone marocain invalide");

// --- AuthSchema ---

export const AuthRegisterSchema = z.object({
  email: z.string().email("Email invalide"),
  phone: phoneSchema,
  password: z
    .string()
    .min(8, "Minimum 8 caractères")
    .regex(/[A-Z]/, "Au moins une majuscule")
    .regex(/[0-9]/, "Au moins un chiffre"),
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  role: z.enum(["CITIZEN", "ARTISAN"]),
  locale: z.enum(["fr", "ar", "en"]).default("fr"),
});

export const AuthLoginSchema = z.object({
  identifier: z.string().min(1, "Email ou téléphone requis"),
  password: z.string().min(1, "Mot de passe requis"),
});

export const AuthOtpRequestSchema = z.object({
  phone: phoneSchema,
  purpose: z.enum(["REGISTER", "LOGIN", "RESET_PASSWORD", "VERIFY_PHONE"]),
});

export const AuthOtpVerifySchema = z.object({
  phone: phoneSchema,
  code: z.string().length(6, "Code OTP à 6 chiffres"),
  purpose: z.enum(["REGISTER", "LOGIN", "RESET_PASSWORD", "VERIFY_PHONE"]),
});

export const AuthRefreshSchema = z.object({
  refreshToken: z.string().min(1),
});

export const AuthSchema = {
  register: AuthRegisterSchema,
  login: AuthLoginSchema,
  otpRequest: AuthOtpRequestSchema,
  otpVerify: AuthOtpVerifySchema,
  refresh: AuthRefreshSchema,
};

export type AuthRegisterInput = z.infer<typeof AuthRegisterSchema>;
export type AuthLoginInput = z.infer<typeof AuthLoginSchema>;
export type AuthOtpRequestInput = z.infer<typeof AuthOtpRequestSchema>;
export type AuthOtpVerifyInput = z.infer<typeof AuthOtpVerifySchema>;

// --- ProfileSchema ---

export const ProfileUpdateSchema = z.object({
  firstName: z.string().min(2).max(50).optional(),
  lastName: z.string().min(2).max(50).optional(),
  bio: z.string().max(500).optional(),
  avatarUrl: z.string().url().optional(),
  locale: z.enum(["fr", "ar", "en"]).optional(),
});

export const ArtisanProfileSchema = z.object({
  categoryIds: z.array(z.string().uuid()).min(1, "Au moins une catégorie"),
  serviceRadiusKm: z.number().min(1).max(100).default(15),
  baseLocation: geoPointSchema,
  cinNumber: z.string().optional(),
  tradeLicenseUrl: z.string().url().optional(),
});

export const ProfileSchema = {
  update: ProfileUpdateSchema,
  artisan: ArtisanProfileSchema,
};

export type ProfileUpdateInput = z.infer<typeof ProfileUpdateSchema>;
export type ArtisanProfileInput = z.infer<typeof ArtisanProfileSchema>;

// --- JobSchema ---

export const JobCreateSchema = z.object({
  categoryId: z.string().uuid(),
  title: z.string().min(5).max(120),
  description: z.string().min(20).max(2000),
  urgency: z.enum(["LOW", "NORMAL", "HIGH", "EMERGENCY"]).default("NORMAL"),
  location: geoAddressSchema,
  scheduledAt: z.string().datetime().optional(),
  budgetMin: z.number().positive().optional(),
  budgetMax: z.number().positive().optional(),
  currency: z.literal("MAD").default("MAD"),
  images: z.array(z.string().url()).max(5).optional(),
});

export const JobUpdateSchema = JobCreateSchema.partial();

export const JobQuerySchema = z.object({
  status: z
    .enum([
      "DRAFT",
      "OPEN",
      "MATCHING",
      "ASSIGNED",
      "IN_PROGRESS",
      "COMPLETED",
      "CANCELLED",
      "DISPUTED",
    ])
    .optional(),
  categoryId: z.string().uuid().optional(),
  urgency: z.enum(["LOW", "NORMAL", "HIGH", "EMERGENCY"]).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export const JobSchema = {
  create: JobCreateSchema,
  update: JobUpdateSchema,
  query: JobQuerySchema,
};

export type JobCreateInput = z.infer<typeof JobCreateSchema>;
export type JobUpdateInput = z.infer<typeof JobUpdateSchema>;
export type JobQueryInput = z.infer<typeof JobQuerySchema>;

// --- OfferSchema ---

export const OfferCreateSchema = z.object({
  jobId: z.string().uuid(),
  amount: z.number().positive("Montant invalide"),
  currency: z.literal("MAD").default("MAD"),
  message: z.string().max(500).optional(),
  estimatedDurationMinutes: z.number().int().positive().max(24 * 60).optional(),
});

export const OfferUpdateSchema = z.object({
  status: z.enum(["WITHDRAWN"]),
});

export const OfferSchema = {
  create: OfferCreateSchema,
  update: OfferUpdateSchema,
};

export type OfferCreateInput = z.infer<typeof OfferCreateSchema>;
export type OfferUpdateInput = z.infer<typeof OfferUpdateSchema>;
