import type { RequestHandler } from "express";
import multer, { type FileFilterCallback } from "multer";
import type { Request } from "express";

const CHAT_MIME = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "audio/mpeg",
  "audio/mp4",
  "audio/aac",
  "audio/webm",
] as const;

function chatMediaFilter(_req: Request, file: Express.Multer.File, cb: FileFilterCallback): void {
  if (CHAT_MIME.includes(file.mimetype as (typeof CHAT_MIME)[number])) {
    cb(null, true);
    return;
  }
  cb(new Error("Média chat non supporté"));
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024, files: 1 },
  fileFilter: chatMediaFilter,
});

export const chatMediaUpload: RequestHandler = upload.single("media");
