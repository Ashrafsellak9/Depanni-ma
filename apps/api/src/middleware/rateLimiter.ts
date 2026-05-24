import rateLimit from "express-rate-limit";

import { env } from "../config/env.js";

const baseOptions = {
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: { code: "RATE_LIMIT", message: "Trop de requêtes, réessayez plus tard" },
  },
};

export const globalLimiter = rateLimit({
  ...baseOptions,
  max: env.RATE_LIMIT_MAX_REQUESTS,
});

export const authLimiter = rateLimit({
  ...baseOptions,
  max: 20,
  windowMs: 15 * 60 * 1000,
});

export const otpLimiter = rateLimit({
  ...baseOptions,
  max: 5,
  windowMs: 15 * 60 * 1000,
});

export const uploadLimiter = rateLimit({
  ...baseOptions,
  max: 30,
  windowMs: 60 * 60 * 1000,
});
