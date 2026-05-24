import compression from "compression";
import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";

import { corsOrigins, env } from "./config/env.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import { httpLogger } from "./middleware/logger.js";
import { globalLimiter } from "./middleware/rateLimiter.js";
import { paymentsWebhookRouter } from "./modules/payments/payments.webhook.js";
import { apiRouter } from "./routes/index.js";

export function createApp(): Express {
  const app = express();

  app.set("trust proxy", 1);

  // Stripe webhook needs raw body — mount before JSON parser
  app.use("/api/v1/payments", paymentsWebhookRouter);

  app.use(helmet());
  app.use(
    cors({
      origin: corsOrigins,
      credentials: true,
    }),
  );
  app.use(compression());
  app.use(httpLogger);
  app.use(globalLimiter);

  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true }));

  app.use("/api/v1", apiRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
