import { Router, type IRouter } from "express";

import { authenticate, authorize } from "../../middleware/auth.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { reviewsController } from "./reviews.controller.js";

export const reviewsRoutes: IRouter = Router();

reviewsRoutes.use(authenticate);
reviewsRoutes.get("/me", authorize("ARTISAN"), asyncHandler(reviewsController.listMine));
reviewsRoutes.post("/", asyncHandler(reviewsController.create));
