import type { Request } from "express";

import { ValidationError } from "./errors.js";

export function getParam(req: Request, key: string): string {
  const value = req.params[key];
  if (typeof value !== "string" || value.length === 0) {
    throw new ValidationError({ [key]: "Paramètre invalide" });
  }
  return value;
}
