import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import type { JwtPayload, UserRole } from "@depanni/types";

import { env } from "../config/env.js";
import { ForbiddenError, UnauthorizedError } from "../utils/errors.js";
import { asyncHandler } from "../utils/asyncHandler.js";

interface AccessTokenPayload extends JwtPayload {
  email: string;
}

export const authenticate = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      throw new UnauthorizedError("Token manquant");
    }

    const token = header.slice(7);
    const decoded = jwt.verify(token, env.JWT_SECRET) as AccessTokenPayload;

    req.user = {
      id: decoded.sub,
      email: decoded.email,
      role: decoded.role,
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
      const decoded = jwt.verify(token, env.JWT_SECRET) as AccessTokenPayload;
      req.user = { id: decoded.sub, email: decoded.email, role: decoded.role };
    } catch {
      // ignore invalid token for optional auth
    }
    next();
  },
);
