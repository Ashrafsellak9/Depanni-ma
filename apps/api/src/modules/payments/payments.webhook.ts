import { Router, type IRouter } from "express";
import express from "express";

import { asyncHandler } from "../../utils/asyncHandler.js";
import { paymentsController } from "./payments.controller.js";

export const paymentsWebhookRouter: IRouter = Router();

paymentsWebhookRouter.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  asyncHandler(paymentsController.webhook),
);
