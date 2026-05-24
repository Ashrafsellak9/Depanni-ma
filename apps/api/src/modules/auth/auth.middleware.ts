import type {
  CookieOptions,
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from "express";
import multer, { type FileFilterCallback } from "multer";

import { env } from "../../config/env.js";

const KYC_MIME = ["image/jpeg", "image/png", "image/webp", "application/pdf"] as const;

export function getRefreshCookieOptions(maxAgeMs: number): CookieOptions {
  return {
    httpOnly: true,
    secure: env.COOKIE_SECURE,
    sameSite: "lax",
    path: "/api/auth",
    maxAge: maxAgeMs,
    ...(env.COOKIE_DOMAIN ? { domain: env.COOKIE_DOMAIN } : {}),
  };
}

export function setRefreshCookie(res: Response, refreshToken: string): void {
  const maxAgeMs = 7 * 24 * 60 * 60 * 1000;
  res.cookie(env.REFRESH_COOKIE_NAME, refreshToken, getRefreshCookieOptions(maxAgeMs));
}

export function clearRefreshCookie(res: Response): void {
  res.clearCookie(env.REFRESH_COOKIE_NAME, {
    httpOnly: true,
    secure: env.COOKIE_SECURE,
    sameSite: "lax",
    path: "/api/auth",
    ...(env.COOKIE_DOMAIN ? { domain: env.COOKIE_DOMAIN } : {}),
  });
}

export function getRefreshTokenFromRequest(req: Request): string | undefined {
  return req.cookies?.[env.REFRESH_COOKIE_NAME] as string | undefined;
}

const kycStorage = multer.memoryStorage();

function kycFileFilter(
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
): void {
  if (KYC_MIME.includes(file.mimetype as (typeof KYC_MIME)[number])) {
    cb(null, true);
    return;
  }
  cb(new Error("Type de fichier KYC non supporté (JPEG, PNG, WebP, PDF)"));
}

export const kycUpload = multer({
  storage: kycStorage,
  limits: { fileSize: 10 * 1024 * 1024, files: 2 },
  fileFilter: kycFileFilter,
});

export const artisanKycFields: RequestHandler = kycUpload.fields([
  { name: "cinDocument", maxCount: 1 },
  { name: "tradeLicense", maxCount: 1 },
]);

export function handleMulterError(
  err: unknown,
  _req: Request,
  _res: Response,
  next: NextFunction,
): void {
  next(err);
}
