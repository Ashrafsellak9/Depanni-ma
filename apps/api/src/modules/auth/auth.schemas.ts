import { z } from "zod";

export const moroccanPhoneSchema = z
  .string()
  .regex(/^(\+212|0)[5-7]\d{8}$/, "Numéro de téléphone marocain invalide");

export const passwordSchema = z
  .string()
  .min(8, "Minimum 8 caractères")
  .regex(/[A-Z]/, "Au moins une majuscule")
  .regex(/[0-9]/, "Au moins un chiffre");

export const registerCitizenSchema = z.object({
  email: z.string().email("Email invalide"),
  phone: moroccanPhoneSchema,
  password: passwordSchema,
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  locale: z.enum(["fr", "ar", "en"]).default("fr"),
});

export const registerArtisanSchema = z.object({
  email: z.string().email("Email invalide"),
  phone: moroccanPhoneSchema,
  password: passwordSchema,
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  locale: z.enum(["fr", "ar", "en"]).default("fr"),
  cinNumber: z.string().min(4).max(20).optional(),
  serviceRadiusKm: z.coerce.number().min(1).max(100).default(15),
  baseLat: z.coerce.number().min(-90).max(90).optional(),
  baseLng: z.coerce.number().min(-180).max(180).optional(),
});

export const verifyOtpSchema = z.object({
  phone: moroccanPhoneSchema,
  code: z.string().regex(/^\d{6}$/, "Code OTP à 6 chiffres"),
  purpose: z.enum(["REGISTER", "RESET_PASSWORD", "VERIFY_PHONE"]),
});

export const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(1, "Mot de passe requis"),
});

export const forgotPasswordSchema = z.object({
  phone: moroccanPhoneSchema,
});

export const resetPasswordSchema = z.object({
  phone: moroccanPhoneSchema,
  code: z.string().regex(/^\d{6}$/, "Code OTP à 6 chiffres"),
  password: passwordSchema,
});

export type RegisterCitizenInput = z.infer<typeof registerCitizenSchema>;
export type RegisterArtisanInput = z.infer<typeof registerArtisanSchema>;
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

export type OtpPurpose = VerifyOtpInput["purpose"];
