import { config } from "dotenv";
import { z } from "zod";

config();

/** `.env` often sets `KEY=` — Zod `.optional()` only skips `undefined`, not `""`. */
function emptyToUndefined(val: unknown): unknown {
  if (typeof val !== "string") return val;
  const trimmed = val.trim();
  return trimmed === "" ? undefined : trimmed;
}

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  API_PORT: z.coerce.number().int().positive().default(4000),
  CORS_ORIGIN: z.string().default("http://localhost:3000,http://localhost:3001"),

  DATABASE_URL: z
    .string()
    .default("postgresql://depanni:depanni_dev@localhost:5433/depanni?schema=public"),
  /** Prisma pool size (appended to DATABASE_URL as connection_limit). */
  DATABASE_POOL_SIZE: z.coerce.number().int().min(1).max(50).default(10),

  SENTRY_DSN: z.preprocess(emptyToUndefined, z.string().url().optional()),

  REDIS_URL: z.string().default("redis://localhost:6379"),

  JWT_PRIVATE_KEY: z.string().optional(),
  JWT_PUBLIC_KEY: z.string().optional(),
  /** Clé publique précédente (rotation — tokens signés encore valides). */
  JWT_PREVIOUS_PUBLIC_KEY: z.string().optional(),
  JWT_KEY_ID: z.string().default("depanni-1"),
  JWT_ACCESS_EXPIRES_IN: z.string().default("15m"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),

  REFRESH_COOKIE_NAME: z.string().default("depanni_refresh"),
  COOKIE_SECURE: z
    .string()
    .default("false")
    .transform((v) => v === "true"),
  COOKIE_DOMAIN: z.string().optional(),

  OTP_TTL_SECONDS: z.coerce.number().int().positive().default(300),
  OTP_MAX_ATTEMPTS: z.coerce.number().int().positive().default(3),
  OTP_LOCK_SECONDS: z.coerce.number().int().positive().default(1800),

  TWILIO_ACCOUNT_SID: z.string().optional(),
  TWILIO_AUTH_TOKEN: z.string().optional(),
  TWILIO_PHONE_NUMBER: z.string().optional(),

  FIREBASE_PROJECT_ID: z.string().optional(),
  FIREBASE_CLIENT_EMAIL: z.string().optional(),
  FIREBASE_PRIVATE_KEY: z.string().optional(),

  S3_ENDPOINT: z.string().optional(),
  S3_REGION: z.string().default("auto"),
  S3_BUCKET: z.string().optional(),
  S3_ACCESS_KEY_ID: z.string().optional(),
  S3_SECRET_ACCESS_KEY: z.string().optional(),
  S3_PUBLIC_URL: z.string().optional(),

  GOOGLE_MAPS_API_KEY: z.string().optional(),

  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),

  CMI_MERCHANT_ID: z.string().optional(),
  CMI_STORE_KEY: z.string().optional(),
  CMI_GATEWAY_URL: z
    .string()
    .default("https://payment.cmi.co.ma/fim/est3Dgate"),
  CMI_CALLBACK_URL: z
    .string()
    .default("http://localhost:4000/api/payments/cmi/callback"),
  CMI_RETURN_URL: z.string().default("http://localhost:3000/payment/success"),

  WALLET_COMMISSION_RATE_STANDARD: z.coerce.number().min(0).max(1).default(0.15),
  WALLET_COMMISSION_RATE_PREMIUM: z.coerce.number().min(0).max(1).default(0.1),
  WALLET_COMMISSION_RATE_PRO: z.coerce.number().min(0).max(1).default(0.07),
  DISPUTE_FREEZE_HOURS: z.coerce.number().int().positive().default(72),

  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(60_000),
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().int().positive().default(100),

  SOCKET_PATH: z.string().default("/socket.io"),
  SOCKET_CORS_ORIGIN: z.string().optional(),

  LOG_LEVEL: z.enum(["error", "warn", "info", "http", "debug"]).default("info"),

  /** Email comptable — rapport mensuel automatique le 1er du mois */
  ACCOUNTING_EMAIL: z.preprocess(emptyToUndefined, z.string().email().optional()),
});

export type Env = z.infer<typeof envSchema>;

function parseEnv(): Env {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    const formatted = result.error.flatten().fieldErrors;
    console.error("Invalid environment variables:", formatted);
    process.exit(1);
  }
  const data = result.data;
  if (data.NODE_ENV === "production") {
    if (!data.JWT_PRIVATE_KEY || !data.JWT_PUBLIC_KEY) {
      console.error("Production requires JWT_PRIVATE_KEY and JWT_PUBLIC_KEY");
      process.exit(1);
    }
    if (!data.COOKIE_SECURE) {
      console.warn("WARN: COOKIE_SECURE=false in production");
    }
  }
  return data;
}

export const env = parseEnv();

export const corsOrigins = env.CORS_ORIGIN.split(",").map((o) => o.trim());

export const socketCorsOrigins = (env.SOCKET_CORS_ORIGIN ?? env.CORS_ORIGIN)
  .split(",")
  .map((o) => o.trim());
