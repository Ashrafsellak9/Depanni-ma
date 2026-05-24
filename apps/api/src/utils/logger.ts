import winston from "winston";

import { env } from "../config/env.js";

const { combine, timestamp, printf, colorize, errors } = winston.format;

const logFormat = printf((info: winston.Logform.TransformableInfo) => {
  const { level, message, timestamp: ts, stack, ...meta } = info;
  const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : "";
  return `${String(ts)} [${String(level)}]: ${String(stack ?? message)}${metaStr}`;
});

export const logger = winston.createLogger({
  level: env.LOG_LEVEL,
  format: combine(errors({ stack: true }), timestamp(), logFormat),
  transports: [
    new winston.transports.Console({
      format: env.NODE_ENV === "development" ? combine(colorize(), logFormat) : logFormat,
    }),
  ],
});
