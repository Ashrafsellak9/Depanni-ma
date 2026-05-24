import { Router, type IRouter } from "express";

import { authenticate } from "../../middleware/auth.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { paymentsController } from "./payments.controller.js";

export const paymentsRoutes: IRouter = Router();

paymentsRoutes.post("/intent", authenticate, asyncHandler(paymentsController.createIntent));
