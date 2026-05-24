import type { NextFunction, Request, Response } from "express";

import type { UserRole } from "@depanni/types";

import { verifyAccessToken } from "../config/jwt.js";
import { ForbiddenError, UnauthorizedError } from "../utils/errors.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const authenticate = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      throw new UnauthorizedError("Token manquant");
    }

    const token = header.slice(7);
    const decoded = verifyAccessToken(token);

    req.user = {
      id: decoded.userId,
      email: "",
      role: decoded.role,
      artisanId: decoded.artisanId,
    };

    next();
  },
);

export function authorize(...roles: UserRole[]) {
  return asyncHandler(async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedError();
    }
    if (!roles.includes(req.user.role)) {
      throw new ForbiddenError();
    }
    next();
  });
}

export const optionalAuth = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      next();
      return;
    }

    try {
      const token = header.slice(7);
      const decoded = verifyAccessToken(token);
      req.user = {
        id: decoded.userId,
        email: "",
        role: decoded.role,
        artisanId: decoded.artisanId,
      };
    } catch {
      // ignore invalid token for optional auth
    }
    next();
  },
);
