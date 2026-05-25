import { env } from "../config/env.js";
import { logger } from "../utils/logger.js";

let initialized = false;

export function initSentry(): void {
  if (!env.SENTRY_DSN || initialized) return;
  try {
    // Dynamic import keeps API bootable without @sentry/node installed in dev
    void import("@sentry/node").then((Sentry) => {
      Sentry.init({
        dsn: env.SENTRY_DSN,
        environment: env.NODE_ENV,
        tracesSampleRate: env.NODE_ENV === "production" ? 0.1 : 0,
      });
      initialized = true;
      logger.info("Sentry initialized");
    });
  } catch {
    logger.warn("Sentry package not installed — error tracking disabled");
  }
}

export function captureException(err: unknown, context?: Record<string, unknown>): void {
  if (!env.SENTRY_DSN) return;
  void import("@sentry/node")
    .then((Sentry) => {
      Sentry.captureException(err, { extra: context });
    })
    .catch(() => undefined);
}
