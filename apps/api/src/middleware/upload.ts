import type { Request } from "express";
import multer, { type FileFilterCallback } from "multer";
import sharp from "sharp";
import { randomUUID } from "node:crypto";

import { getPublicUrl, getS3, getS3Bucket } from "../config/s3.js";
import { AppError } from "../utils/errors.js";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
type AllowedMime = (typeof ALLOWED_MIME_TYPES)[number];

const memoryStorage = multer.memoryStorage();

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

export async function processAndUploadImage(
  buffer: Buffer,
  folder = "uploads",
): Promise<UploadedFileResult> {
  const s3 = getS3();
  if (!s3) {
    throw new AppError(503, "S3_UNAVAILABLE", "Service de stockage indisponible");
  }

  const processed = await sharp(buffer)
    .resize(1920, 1920, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: 85 })
    .toBuffer({ resolveWithObject: true });

  const key = `${folder}/${randomUUID()}.webp`;

  await s3
    .upload({
      Bucket: getS3Bucket(),
      Key: key,
      Body: processed.data,
      ContentType: "image/webp",
      ACL: "public-read",
    })
    .promise();

  return {
    key,
    url: getPublicUrl(key),
    width: processed.info.width,
    height: processed.info.height,
  };
}
