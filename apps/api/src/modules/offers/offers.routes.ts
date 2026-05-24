import { Router, type IRouter } from "express";

import { authenticate, authorize } from "../../middleware/auth.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { offersController } from "./offers.controller.js";

export const offersRoutes: IRouter = Router();

offersRoutes.get("/job/:jobId", authenticate, asyncHandler(offersController.listByJob));
offersRoutes.post("/", authenticate, authorize("ARTISAN"), asyncHandler(offersController.create));
