import type { NextFunction, Request, Response } from "express";

import { validateUploadedFiles } from "../lib/fileValidation.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export function validateUploadMagic(mode: "image" | "kyc") {
  return asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
    const files: Express.Multer.File[] = [];
    if (Array.isArray(req.files)) {
      files.push(...req.files);
    } else if (req.files && typeof req.files === "object") {
      for (const arr of Object.values(req.files)) {
        if (Array.isArray(arr)) files.push(...arr);
      }
    }
    if (req.file) files.push(req.file);
    if (files.length > 0) {
      await validateUploadedFiles(files, mode);
    }
    next();
  });
}
