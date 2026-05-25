import { fileTypeFromBuffer } from "file-type";

const ALLOWED_IMAGE = new Set(["image/jpeg", "image/png", "image/webp"]);
const ALLOWED_DOC = new Set(["image/jpeg", "image/png", "image/webp", "application/pdf"]);

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

export async function assertImageBuffer(
  buffer: Buffer,
  label = "Fichier",
): Promise<void> {
  if (buffer.length > MAX_UPLOAD_BYTES) {
    throw new Error(`${label}: taille max ${MAX_UPLOAD_BYTES / 1024 / 1024} Mo`);
  }
  const detected = await fileTypeFromBuffer(buffer);
  if (!detected || !ALLOWED_IMAGE.has(detected.mime)) {
    throw new Error(`${label}: type non autorisé (JPEG, PNG, WebP uniquement)`);
  }
}

export async function assertKycBuffer(buffer: Buffer, label = "Document"): Promise<void> {
  if (buffer.length > MAX_UPLOAD_BYTES) {
    throw new Error(`${label}: taille max ${MAX_UPLOAD_BYTES / 1024 / 1024} Mo`);
  }
  const detected = await fileTypeFromBuffer(buffer);
  if (!detected || !ALLOWED_DOC.has(detected.mime)) {
    throw new Error(`${label}: JPEG, PNG, WebP ou PDF uniquement`);
  }
}

export async function validateUploadedFiles(
  files: Express.Multer.File[],
  mode: "image" | "kyc",
): Promise<void> {
  const assert = mode === "kyc" ? assertKycBuffer : assertImageBuffer;
  for (const file of files) {
    await assert(file.buffer, file.originalname);
  }
}
