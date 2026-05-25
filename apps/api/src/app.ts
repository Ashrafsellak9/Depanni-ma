import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { type Express } from "express";

import { corsOrigins } from "./config/env.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import { httpLogger } from "./middleware/logger.js";
import { globalLimiter } from "./middleware/rateLimiter.js";
import {
  applyHelmet,
  forceHttps,
  httpParameterPollution,
  sanitizeInput,
} from "./middleware/security.js";
import { adminRoutes } from "./modules/admin/admin.routes.js";
import { artisansRoutes } from "./modules/artisans/artisans.routes.js";
import { authRoutes } from "./modules/auth/auth.routes.js";
import { chatRoutes } from "./modules/chat/chat.routes.js";
import { trackingRoutes } from "./modules/tracking/tracking.routes.js";
import { jobsRoutes } from "./modules/jobs/jobs.routes.js";
import {
  paymentsAdminRoutes,
  paymentsRoutes,
  walletRoutes,
} from "./modules/payments/payments.routes.js";
import { paymentsCmiRouter } from "./modules/payments/payments.webhook.js";
import { usersRoutes } from "./modules/users/users.routes.js";
import { apiRouter } from "./routes/index.js";

export function createApp(): Express {
  const app = express();

  app.set("trust proxy", 1);

  // CMI webhook (urlencoded) — avant express.json
  app.use("/api/payments", paymentsCmiRouter);
  app.use("/api/v1/payments", paymentsCmiRouter);

  applyHelmet(app);
  app.use(forceHttps);
  app.use(
    cors({
      origin: corsOrigins,
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    }),
  );
  app.use(httpParameterPollution);
  app.use(compression());
  app.use(cookieParser());
  app.use(httpLogger);
  app.use(globalLimiter);

  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));
  app.use(sanitizeInput);

  app.use("/api/auth", authRoutes);
  app.use("/api/v1/auth", authRoutes);

  app.use("/api/users", usersRoutes);
  app.use("/api/v1/users", usersRoutes);
  app.use("/api/artisans", artisansRoutes);
  app.use("/api/v1/artisans", artisansRoutes);
  app.use("/api/admin", adminRoutes);
  app.use("/api/v1/admin", adminRoutes);
  app.use("/api/jobs", jobsRoutes);
  app.use("/api/v1/jobs", jobsRoutes);
  app.use("/api/payments", paymentsRoutes);
  app.use("/api/v1/payments", paymentsRoutes);
  app.use("/api/wallet", walletRoutes);
  app.use("/api/v1/wallet", walletRoutes);
  app.use("/api/admin", paymentsAdminRoutes);
  app.use("/api/v1/admin", paymentsAdminRoutes);
  app.use("/api/chat", chatRoutes);
  app.use("/api/v1/chat", chatRoutes);
  app.use("/api/tracking", trackingRoutes);
  app.use("/api/v1/tracking", trackingRoutes);

  app.use("/api/v1", apiRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
