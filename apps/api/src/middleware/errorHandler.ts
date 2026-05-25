import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

import type { ApiResponse } from "@depanni/types";

import { env } from "../config/env.js";
import { captureException } from "../monitoring/sentry.js";
import { AppError } from "../utils/errors.js";
import { logger } from "../utils/logger.js";

export function notFoundHandler(_req: Request, res: Response): void {
  const body: ApiResponse<never> = {
    success: false,
    error: { code: "NOT_FOUND", message: "Route introuvable" },
  };
  res.status(404).json(body);
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    const body: ApiResponse<never> = {
      success: false,
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
      },
    };
    res.status(err.statusCode).json(body);
    return;
  }

  if (err instanceof ZodError) {
    const body: ApiResponse<never> = {
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Données invalides",
        details: { issues: err.flatten() },
      },
    };
    res.status(400).json(body);
    return;
  }

  logger.error("Unhandled error", {
    err: err instanceof Error ? err.message : String(err),
    stack: err instanceof Error ? err.stack : undefined,
  });
  captureException(err);

  const body: ApiResponse<never> = {
    success: false,
    error: {
      code: "INTERNAL_ERROR",
      message:
        env.NODE_ENV === "production"
          ? "Une erreur interne est survenue"
          : err instanceof Error
            ? err.message
            : "Unknown error",
    },
  };
  res.status(500).json(body);
}
