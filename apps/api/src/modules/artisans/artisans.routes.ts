import { Router, type IRouter } from "express";

import { authenticate, authorize } from "../../middleware/auth.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { artisansController } from "./artisans.controller.js";
import { artisanKycUpload } from "./artisans.middleware.js";

export const artisansRoutes: IRouter = Router();

// Public
artisansRoutes.get("/nearby", asyncHandler(artisansController.getNearby));
artisansRoutes.get("/:id/public", asyncHandler(artisansController.getPublicProfile));

// Artisan authentifié
artisansRoutes.use(authenticate, authorize("ARTISAN"));

artisansRoutes.get("/me", asyncHandler(artisansController.getMe));
artisansRoutes.patch("/me", asyncHandler(artisansController.updateMe));
artisansRoutes.post("/me/availability", asyncHandler(artisansController.setAvailability));
artisansRoutes.post("/me/location", asyncHandler(artisansController.updateLocation));
artisansRoutes.get("/me/earnings", asyncHandler(artisansController.getEarnings));
artisansRoutes.get("/me/missions", asyncHandler(artisansController.listMissions));
artisansRoutes.get("/me/missions/:missionId", asyncHandler(artisansController.getMission));
artisansRoutes.post("/me/payout-request", asyncHandler(artisansController.requestPayout));
artisansRoutes.post("/me/subscription/upgrade", asyncHandler(artisansController.upgradeSubscription));
artisansRoutes.post(
  "/me/kyc",
  artisanKycUpload,
  asyncHandler(artisansController.uploadKyc),
);
