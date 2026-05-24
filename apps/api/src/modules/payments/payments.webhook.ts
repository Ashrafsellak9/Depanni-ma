import { Router, type IRouter } from "express";
import express from "express";

import { asyncHandler } from "../../utils/asyncHandler.js";
import { paymentsController } from "./payments.controller.js";

/** Webhook CMI — body urlencoded, monté AVANT express.json dans app.ts */
export const paymentsCmiRouter: IRouter = Router();

paymentsCmiRouter.post(
  "/cmi/callback",
  express.urlencoded({ extended: true }),
  asyncHandler(paymentsController.cmiCallback),
);
