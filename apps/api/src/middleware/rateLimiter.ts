import type { Request } from "express";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";

import { env } from "../config/env.js";

const baseOptions = {
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: { code: "RATE_LIMIT", message: "Trop de requêtes, réessayez plus tard" },
  },
};

export const globalLimiter = rateLimit({
  ...baseOptions,
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX_REQUESTS,
});

/** 5 tentatives / 15 min par IP (login, verify-otp, reset-password) */
export const loginLimiter = rateLimit({
  ...baseOptions,
  windowMs: 15 * 60 * 1000,
  max: 5,
  keyGenerator: (req: Request): string => ipKeyGenerator(req.ip ?? "unknown"),
});

/** 3 SMS OTP / heure par numéro (register, resend-otp, forgot-password) */
export const otpSendLimiter = rateLimit({
  ...baseOptions,
  windowMs: 60 * 60 * 1000,
  max: 3,
  keyGenerator: (req: Request): string => {
    const body = req.body as { phone?: string } | undefined;
    if (body?.phone) return `phone:${body.phone}`;
    return ipKeyGenerator(req.ip ?? "unknown");
  },
});

/** 10 créations de jobs / heure par citoyen */
export const jobsCreateLimiter = rateLimit({
  ...baseOptions,
  windowMs: 60 * 60 * 1000,
  max: 10,
  keyGenerator: (req: Request): string => {
    if (req.user?.id) return `user:${req.user.id}`;
    return ipKeyGenerator(req.ip ?? "unknown");
  },
});

/** 20 offres / heure par artisan */
export const offersCreateLimiter = rateLimit({
  ...baseOptions,
  windowMs: 60 * 60 * 1000,
  max: 20,
  keyGenerator: (req: Request): string => {
    const artisanId = req.user?.artisanId;
    if (artisanId) return `artisan:${artisanId}`;
    return ipKeyGenerator(req.ip ?? "unknown");
  },
});

/** 60 recherches nearby / min par IP */
export const nearbyLimiter = rateLimit({
  ...baseOptions,
  windowMs: 60 * 1000,
  max: 60,
  keyGenerator: (req: Request): string => ipKeyGenerator(req.ip ?? "unknown"),
});

export const authLimiter = loginLimiter;

export const uploadLimiter = rateLimit({
  ...baseOptions,
  windowMs: 60 * 60 * 1000,
  max: 30,
});
