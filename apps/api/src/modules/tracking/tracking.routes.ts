import { Router, type IRouter } from "express";

import { authenticate } from "../../middleware/auth.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { trackingController } from "./tracking.controller.js";

export const trackingRoutes: IRouter = Router();

trackingRoutes.use(authenticate);

trackingRoutes.get(
  "/missions/:missionId",
  asyncHandler(trackingController.getMissionTracking),
);

// Rétrocompat
trackingRoutes.put("/:artisanId/location", asyncHandler(trackingController.updateLocation));
trackingRoutes.get("/:artisanId/location", asyncHandler(trackingController.getLocation));
trackingRoutes.post("/eta", asyncHandler(trackingController.getEta));
