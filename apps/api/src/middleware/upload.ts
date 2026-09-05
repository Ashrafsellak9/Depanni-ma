import type { Request } from "express";
import multer, { type FileFilterCallback } from "multer";
import sharp from "sharp";
import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import {
  getLocalPublicUrl,
  getLocalUploadRoot,
  isLocalStorageEnabled,
} from "../config/localStorage.js";
import {
  getPublicUrl,
  getS3,
  getS3Bucket,
  supportsObjectAcl,
} from "../config/s3.js";
import { AppError } from "../utils/errors.js";
import { logger } from "../utils/logger.js";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
type AllowedMime = (typeof ALLOWED_MIME_TYPES)[number];

const memoryStorage = multer.memoryStorage();

let localFallbackLogged = false;

function fileFilter(
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
): void {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype as AllowedMime)) {
    cb(null, true);
    return;
  }
  cb(new Error("Type de fichier non supporté"));
}

export const upload = multer({
  storage: memoryStorage,
  limits: { fileSize: 5 * 1024 * 1024, files: 5 },
  fileFilter,
});

export interface UploadedFileResult {
  key: string;
  url: string;
  width: number;
  height: number;
}

async function saveLocally(buffer: Buffer, key: string): Promise<void> {
  if (!localFallbackLogged) {
    logger.warn("S3/R2 unavailable — using local .uploads directory (dev/test only)");
    localFallbackLogged = true;
  }

  const fullPath = path.join(getLocalUploadRoot(), key);
  await mkdir(path.dirname(fullPath), { recursive: true });
  await writeFile(fullPath, buffer);
}

async function storeBuffer(
  buffer: Buffer,
  key: string,
  contentType: string,
  options: { publicRead: boolean; width?: number; height?: number },
): Promise<UploadedFileResult> {
  const s3 = getS3();

  if (s3) {
    // R2 n'accepte pas les ACL ; l'accès public passe par S3_PUBLIC_URL.
    await s3
      .upload({
        Bucket: getS3Bucket(),
        Key: key,
        Body: buffer,
        ContentType: contentType,
        ...(options.publicRead && supportsObjectAcl()
          ? { ACL: "public-read" as const }
          : {}),
      })
      .promise();

    return {
      key,
      url: options.publicRead ? getPublicUrl(key) : key,
      width: options.width ?? 0,
      height: options.height ?? 0,
    };
  }

  // Production : jamais de disque local
  if (!isLocalStorageEnabled()) {
    throw new AppError(503, "S3_UNAVAILABLE", "Service de stockage indisponible");
  }

  await saveLocally(buffer, key);

  return {
    key,
    url: options.publicRead ? getLocalPublicUrl(key) : key,
    width: options.width ?? 0,
    height: options.height ?? 0,
  };
}

export async function uploadRawFile(
  buffer: Buffer,
  folder: string,
  contentType: string,
  extension: string,
): Promise<UploadedFileResult> {
  const key = `${folder}/${randomUUID()}.${extension}`;
  return storeBuffer(buffer, key, contentType, { publicRead: true });
}

/** Upload privé (KYC) — pas d'ACL public, accès via signed URL. */
export async function uploadPrivateFile(
  buffer: Buffer,
  folder: string,
  contentType: string,
  extension: string,
): Promise<UploadedFileResult> {
  const key = `${folder}/${randomUUID()}.${extension}`;
  return storeBuffer(buffer, key, contentType, { publicRead: false });
}

export async function processAndUploadImage(
  buffer: Buffer,
  folder = "uploads",
): Promise<UploadedFileResult> {
  const processed = await sharp(buffer)
    .resize(1920, 1920, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: 85 })
    .toBuffer({ resolveWithObject: true });

  const key = `${folder}/${randomUUID()}.webp`;

  return storeBuffer(processed.data, key, "image/webp", {
    publicRead: true,
    width: processed.info.width,
    height: processed.info.height,
  });
}
