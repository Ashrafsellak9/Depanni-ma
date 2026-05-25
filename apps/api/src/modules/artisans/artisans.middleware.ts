import type { RequestHandler } from "express";
import multer, { type FileFilterCallback } from "multer";
import type { Request } from "express";

import { MAX_UPLOAD_BYTES } from "../../lib/fileValidation.js";
import { validateUploadMagic } from "../../middleware/validateUpload.js";

const KYC_MIME = ["image/jpeg", "image/png", "image/webp", "application/pdf"] as const;

function kycFileFilter(_req: Request, file: Express.Multer.File, cb: FileFilterCallback): void {
  if (KYC_MIME.includes(file.mimetype as (typeof KYC_MIME)[number])) {
    cb(null, true);
    return;
  }
  cb(new Error("Type de fichier KYC non supporté (JPEG, PNG, WebP, PDF)"));
}

const kycUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_UPLOAD_BYTES, files: 3 },
  fileFilter: kycFileFilter,
});

const kycFields = kycUpload.fields([
  { name: "cinRecto", maxCount: 1 },
  { name: "cinVerso", maxCount: 1 },
  { name: "diploma", maxCount: 1 },
]);

export const artisanKycUpload: RequestHandler[] = [kycFields, validateUploadMagic("kyc")];
