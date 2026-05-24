import { Router, type IRouter } from "express";

import { authenticate } from "../../middleware/auth.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { reviewsController } from "./reviews.controller.js";

export const reviewsRoutes: IRouter = Router();

reviewsRoutes.use(authenticate);
reviewsRoutes.post("/", asyncHandler(reviewsController.create));
