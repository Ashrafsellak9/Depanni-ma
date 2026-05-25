import { Router, type IRouter } from "express";

import { authenticate } from "../../middleware/auth.js";
import { loginLimiter, otpSendLimiter } from "../../middleware/rateLimiter.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { authController } from "./auth.controller.js";
import { artisanKycFields, handleMulterError } from "./auth.middleware.js";

export const authRoutes: IRouter = Router();

authRoutes.post(
  "/register",
  otpSendLimiter,
  asyncHandler(authController.registerCitizen),
);

authRoutes.post(
  "/register/artisan",
  otpSendLimiter,
  ...artisanKycFields,
  handleMulterError,
  asyncHandler(authController.registerArtisan),
);

authRoutes.post("/resend-otp", otpSendLimiter, asyncHandler(authController.resendOtp));
authRoutes.post("/send-otp", otpSendLimiter, asyncHandler(authController.resendOtp));

authRoutes.post("/verify-otp", loginLimiter, asyncHandler(authController.verifyOtp));

authRoutes.post("/login", loginLimiter, asyncHandler(authController.login));

authRoutes.post("/refresh", asyncHandler(authController.refresh));

authRoutes.post("/logout", asyncHandler(authController.logout));

authRoutes.post(
  "/forgot-password",
  otpSendLimiter,
  asyncHandler(authController.forgotPassword),
);

authRoutes.post("/reset-password", loginLimiter, asyncHandler(authController.resetPassword));

authRoutes.get("/me", authenticate, asyncHandler(authController.me));
