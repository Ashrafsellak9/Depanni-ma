import { Router, type IRouter } from "express";

import { authenticate, authorize } from "../../middleware/auth.js";
import { globalLimiter } from "../../middleware/rateLimiter.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { adminController } from "./admin.controller.js";

export const adminRoutes: IRouter = Router();

/** Public — stats non sensibles pour le panneau de connexion admin */
adminRoutes.get(
  "/login-stats",
  globalLimiter,
  asyncHandler(adminController.loginStats),
);

adminRoutes.use(authenticate, authorize("ADMIN"));

adminRoutes.get("/dashboard", asyncHandler(adminController.dashboard));
adminRoutes.get("/overview", asyncHandler(adminController.overview));

adminRoutes.get("/analytics", asyncHandler(adminController.analytics));
adminRoutes.get("/finances/revenue", asyncHandler(adminController.revenueReport));
adminRoutes.get("/finances/transactions", asyncHandler(adminController.transactionsExport));
adminRoutes.get("/finances/monthly-report", asyncHandler(adminController.monthlyReportPreview));

adminRoutes.get("/missions", asyncHandler(adminController.listMissions));
adminRoutes.get("/missions/:id", asyncHandler(adminController.getMission));

adminRoutes.get("/disputes", asyncHandler(adminController.listDisputes));
adminRoutes.get("/disputes/:id", asyncHandler(adminController.getDispute));
adminRoutes.post("/disputes/:id/resolve", asyncHandler(adminController.resolveDispute));

adminRoutes.get("/artisans/kyc-pending", asyncHandler(adminController.listKycPending));
adminRoutes.get("/artisans/kyc-stats", asyncHandler(adminController.kycStats));
adminRoutes.get("/artisans", asyncHandler(adminController.listArtisans));
adminRoutes.get("/artisans/:id", asyncHandler(adminController.getArtisan));
adminRoutes.post("/artisans/:id/approve", asyncHandler(adminController.approveKyc));
adminRoutes.post("/artisans/:id/reject", asyncHandler(adminController.rejectKyc));
adminRoutes.post("/artisans/:id/suspend", asyncHandler(adminController.suspendArtisan));
adminRoutes.post("/artisans/:id/ban", asyncHandler(adminController.banArtisan));
adminRoutes.post("/artisans/:id/reactivate", asyncHandler(adminController.reactivateArtisan));
adminRoutes.post("/artisans/:id/subscription", asyncHandler(adminController.upgradeSubscription));
adminRoutes.post("/artisans/:id/reset-rating", asyncHandler(adminController.resetRating));
adminRoutes.post("/artisans/:id/message", asyncHandler(adminController.sendArtisanMessage));

adminRoutes.get("/clients", asyncHandler(adminController.listCitizens));

adminRoutes.get("/users", asyncHandler(adminController.listUsers));
