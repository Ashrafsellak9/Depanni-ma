import { Router, type IRouter } from "express";

import { authenticate } from "../../middleware/auth.js";
import { authLimiter } from "../../middleware/rateLimiter.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { authController } from "./auth.controller.js";

export const authRoutes: IRouter = Router();

authRoutes.post("/register", authLimiter, asyncHandler(authController.register));
authRoutes.post("/login", authLimiter, asyncHandler(authController.login));
authRoutes.post("/refresh", authLimiter, asyncHandler(authController.refresh));
authRoutes.get("/me", authenticate, asyncHandler(authController.me));
