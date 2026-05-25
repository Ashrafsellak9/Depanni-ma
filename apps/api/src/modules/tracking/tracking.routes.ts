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
trackingRoutes.post(
  "/missions/:missionId/position",
  asyncHandler(trackingController.postPosition),
);
trackingRoutes.post(
  "/missions/:missionId/arrived",
  asyncHandler(trackingController.postArrived),
);
trackingRoutes.post(
  "/missions/:missionId/start",
  asyncHandler(trackingController.postStart),
);

// Rétrocompat
trackingRoutes.put("/:artisanId/location", asyncHandler(trackingController.updateLocation));
trackingRoutes.get("/:artisanId/location", asyncHandler(trackingController.getLocation));
trackingRoutes.post("/eta", asyncHandler(trackingController.getEta));
