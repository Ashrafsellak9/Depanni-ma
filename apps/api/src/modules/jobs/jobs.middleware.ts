import type { RequestHandler } from "express";
import multer, { type FileFilterCallback } from "multer";
import type { Request } from "express";

import { MAX_UPLOAD_BYTES } from "../../lib/fileValidation.js";
import { validateUploadMagic } from "../../middleware/validateUpload.js";

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
  limits: { fileSize: MAX_UPLOAD_BYTES, files: 5 },
  fileFilter: photoFilter,
});

const multerPhotos = upload.array("photos", 5);

export const jobPhotosUpload: RequestHandler[] = [
  multerPhotos,
  validateUploadMagic("image"),
];
