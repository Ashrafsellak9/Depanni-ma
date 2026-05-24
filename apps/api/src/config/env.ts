import { config } from "dotenv";
import { z } from "zod";

config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  API_PORT: z.coerce.number().int().positive().default(4000),
  CORS_ORIGIN: z.string().default("http://localhost:3000,http://localhost:3001"),

  DATABASE_URL: z
    .string()
    .default("postgresql://depanni:depanni_dev@localhost:5433/depanni?schema=public"),

  REDIS_URL: z.string().default("redis://localhost:6379"),

  JWT_SECRET: z.string().min(32).default("depanni-dev-jwt-secret-change-in-prod-32"),
  JWT_REFRESH_SECRET: z
    .string()
    .min(32)
    .default("depanni-dev-refresh-secret-change-prod-32"),
  JWT_ACCESS_EXPIRES_IN: z.string().default("15m"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),

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

  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(60_000),
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().int().positive().default(100),

  SOCKET_PATH: z.string().default("/socket.io"),
  SOCKET_CORS_ORIGIN: z.string().optional(),

  LOG_LEVEL: z.enum(["error", "warn", "info", "http", "debug"]).default("info"),
});

export type Env = z.infer<typeof envSchema>;

function parseEnv(): Env {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    const formatted = result.error.flatten().fieldErrors;
    console.error("Invalid environment variables:", formatted);
    process.exit(1);
  }
  return result.data;
}

export const env = parseEnv();

export const corsOrigins = env.CORS_ORIGIN.split(",").map((o) => o.trim());

export const socketCorsOrigins = (env.SOCKET_CORS_ORIGIN ?? env.CORS_ORIGIN)
  .split(",")
  .map((o) => o.trim());
