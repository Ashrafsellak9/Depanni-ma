import { Router, type IRouter } from "express";

import { authenticate, authorize } from "../../middleware/auth.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { jobsController } from "./jobs.controller.js";

export const jobsRoutes: IRouter = Router();

jobsRoutes.get("/", asyncHandler(jobsController.list));
jobsRoutes.get("/:id", asyncHandler(jobsController.getById));
jobsRoutes.post("/", authenticate, authorize("CITIZEN"), asyncHandler(jobsController.create));
