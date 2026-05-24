import type { Request } from "express";
import rateLimit from "express-rate-limit";

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
  keyGenerator: (req: Request): string => req.ip ?? "unknown",
});

/** 3 SMS OTP / heure par numéro de téléphone */
export const otpSendLimiter = rateLimit({
  ...baseOptions,
  windowMs: 60 * 60 * 1000,
  max: 3,
  keyGenerator: (req: Request): string => {
    const body = req.body as { phone?: string } | undefined;
    return body?.phone ?? req.ip ?? "unknown";
  },
});

export const authLimiter = loginLimiter;

export const uploadLimiter = rateLimit({
  ...baseOptions,
  windowMs: 60 * 60 * 1000,
  max: 30,
});
