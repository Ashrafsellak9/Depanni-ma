import winston from "winston";

import { env } from "../config/env.js";

const isProd = env.NODE_ENV === "production";

const jsonFormat = winston.format.combine(
  winston.format.errors({ stack: true }),
  winston.format.timestamp(),
  winston.format((info) => {
    info.service = "depanni-api";
    info.environment = env.NODE_ENV;
    return info;
  })(),
  winston.format.json(),
);

const devFormat = winston.format.printf((info: winston.Logform.TransformableInfo) => {
  const { level, message, timestamp: ts, stack, ...meta } = info;
  const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : "";
  return `${String(ts)} [${String(level)}]: ${String(stack ?? message)}${metaStr}`;
});

export const logger = winston.createLogger({
  level: env.LOG_LEVEL,
  format: isProd ? jsonFormat : winston.format.combine(winston.format.errors({ stack: true }), devFormat),
  defaultMeta: { service: "depanni-api" },
  transports: [
    new winston.transports.Console({
      format: isProd ? jsonFormat : winston.format.combine(winston.format.colorize(), devFormat),
    }),
  ],
});

/**
 * Logs structurés JSON → ingestion CloudWatch (ECS/Fargate/Lambda).
 * Définir AWS_REGION + déployer avec awslogs driver, ou brancher un transport custom.
 */
export function auditLog(
  action: string,
  meta: Record<string, unknown> & { actorId?: string; targetId?: string },
): void {
  logger.info("AUDIT", { action, ...meta, audit: true });
}
