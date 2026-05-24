import { Router, type IRouter } from "express";

import { authenticate, authorize } from "../../middleware/auth.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { adminController } from "./admin.controller.js";

export const adminRoutes: IRouter = Router();

adminRoutes.use(authenticate, authorize("ADMIN"));
adminRoutes.get("/dashboard", asyncHandler(adminController.dashboard));
adminRoutes.get("/users", asyncHandler(adminController.listUsers));
