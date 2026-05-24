import { Router, type IRouter } from "express";

import { authenticate, authorize } from "../../middleware/auth.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { artisansController } from "./artisans.controller.js";

export const artisansRoutes: IRouter = Router();

artisansRoutes.post(
  "/profile",
  authenticate,
  authorize("ARTISAN"),
  asyncHandler(artisansController.upsertProfile),
);
artisansRoutes.patch(
  "/availability",
  authenticate,
  authorize("ARTISAN"),
  asyncHandler(artisansController.setAvailability),
);
artisansRoutes.get("/:id", asyncHandler(artisansController.getById));
