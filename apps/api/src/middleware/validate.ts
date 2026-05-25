import type { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";

import { asyncHandler } from "../utils/asyncHandler.js";

export function validateBody<T>(schema: ZodSchema<T>) {
  return asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
    req.body = schema.parse(req.body) as Request["body"];
    next();
  });
}

export function validateQuery<T>(schema: ZodSchema<T>) {
  return asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
    req.query = schema.parse(req.query) as Request["query"];
    next();
  });
}

export function validateParams<T>(schema: ZodSchema<T>) {
  return asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
    req.params = schema.parse(req.params) as Request["params"];
    next();
  });
}
