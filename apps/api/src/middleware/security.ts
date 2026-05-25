import type { Express, Request, RequestHandler, Response, NextFunction } from "express";
import helmet from "helmet";
import hpp from "hpp";
import xss from "xss";

import { corsOrigins, env } from "../config/env.js";

const isProd = env.NODE_ENV === "production";

const OPERATOR_PATTERN = /^\$|\./;

function sanitizeOperators(value: unknown): unknown {
  if (typeof value === "string") {
    return xss(value, { whiteList: {}, stripIgnoreTag: true, stripIgnoreTagBody: true });
  }
  if (Array.isArray(value)) {
    return value.map(sanitizeOperators);
  }
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value)) {
      const safeKey = OPERATOR_PATTERN.test(key) ? key.replace(/^\$|\./g, "_") : key;
      out[safeKey] = sanitizeOperators(val);
    }
    return out;
  }
  return value;
}

/** Helmet + CSP + HSTS (production). */
export function applyHelmet(app: Express): void {
  app.use(
    helmet({
      contentSecurityPolicy: isProd
        ? {
            directives: {
              defaultSrc: ["'self'"],
              scriptSrc: ["'self'"],
              styleSrc: ["'self'", "'unsafe-inline'"],
              imgSrc: ["'self'", "data:", "https:"],
              connectSrc: ["'self'", ...corsOrigins],
              frameSrc: ["'none'"],
              objectSrc: ["'none'"],
            },
          }
        : false,
      hsts: isProd
        ? { maxAge: 31_536_000, includeSubDomains: true, preload: true }
        : false,
      crossOriginResourcePolicy: { policy: "cross-origin" },
      referrerPolicy: { policy: "strict-origin-when-cross-origin" },
    }),
  );
}

/** Reject cleartext when behind TLS terminator (production). */
export const forceHttps: RequestHandler = (req, res, next) => {
  if (!isProd) {
    next();
    return;
  }
  const proto = req.header("x-forwarded-proto");
  if (proto && proto !== "https") {
    res.status(403).json({
      success: false,
      error: { code: "HTTPS_REQUIRED", message: "HTTPS requis" },
    });
    return;
  }
  next();
};

export const httpParameterPollution: RequestHandler = hpp() as (
  req: Request,
  res: Response,
  next: NextFunction,
) => void;

/** NoSQL-style operator injection + XSS on parsed input (Express 5 compatible). */
export const sanitizeInput: RequestHandler = (req, _res, next) => {
  if (req.body && typeof req.body === "object") {
    req.body = sanitizeOperators(req.body);
  }
  next();
};

