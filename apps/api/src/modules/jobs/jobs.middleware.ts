import type { RequestHandler } from "express";
import multer, { type FileFilterCallback } from "multer";
import type { Request } from "express";

const PHOTO_MIME = ["image/jpeg", "image/png", "image/webp"] as const;

function photoFilter(_req: Request, file: Express.Multer.File, cb: FileFilterCallback): void {
  if (PHOTO_MIME.includes(file.mimetype as (typeof PHOTO_MIME)[number])) {
    cb(null, true);
    return;
  }
  cb(new Error("Photo: JPEG, PNG ou WebP uniquement"));
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 5 },
  fileFilter: photoFilter,
});

export const jobPhotosUpload: RequestHandler = upload.array("photos", 5);
