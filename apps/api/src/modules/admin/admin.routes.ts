import { Router, type IRouter } from "express";

import { authenticate, authorize } from "../../middleware/auth.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { adminController } from "./admin.controller.js";

export const adminRoutes: IRouter = Router();

adminRoutes.use(authenticate, authorize("ADMIN"));

adminRoutes.get("/dashboard", asyncHandler(adminController.dashboard));
adminRoutes.get("/overview", asyncHandler(adminController.overview));

adminRoutes.get("/missions", asyncHandler(adminController.listMissions));
adminRoutes.get("/missions/:id", asyncHandler(adminController.getMission));

adminRoutes.get("/artisans/kyc-pending", asyncHandler(adminController.listKycPending));
adminRoutes.get("/artisans", asyncHandler(adminController.listArtisans));
adminRoutes.get("/artisans/:id", asyncHandler(adminController.getArtisan));
adminRoutes.post("/artisans/:id/approve", asyncHandler(adminController.approveKyc));
adminRoutes.post("/artisans/:id/reject", asyncHandler(adminController.rejectKyc));

adminRoutes.get("/clients", asyncHandler(adminController.listCitizens));

adminRoutes.get("/users", asyncHandler(adminController.listUsers));
