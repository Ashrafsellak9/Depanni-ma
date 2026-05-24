import { Router, type IRouter } from "express";

import type { ApiResponse } from "@depanni/types";

import { adminRoutes } from "../modules/admin/admin.routes.js";
import { artisansRoutes } from "../modules/artisans/artisans.routes.js";
import { jobsRoutes } from "../modules/jobs/jobs.routes.js";
import { offersRoutes } from "../modules/offers/offers.routes.js";
import { paymentsRoutes } from "../modules/payments/payments.routes.js";
// payments webhook mounted in app.ts (raw body)
import { reviewsRoutes } from "../modules/reviews/reviews.routes.js";
import { trackingRoutes } from "../modules/tracking/tracking.routes.js";
import { usersRoutes } from "../modules/users/users.routes.js";

export const apiRouter: IRouter = Router();

apiRouter.get("/health", (_req, res) => {
  const body: ApiResponse<{ status: string; timestamp: string }> = {
    success: true,
    data: { status: "ok", timestamp: new Date().toISOString() },
  };
  res.json(body);
});

apiRouter.use("/users", usersRoutes);
apiRouter.use("/artisans", artisansRoutes);
apiRouter.use("/jobs", jobsRoutes);
apiRouter.use("/offers", offersRoutes);
apiRouter.use("/tracking", trackingRoutes);
apiRouter.use("/payments", paymentsRoutes);
apiRouter.use("/reviews", reviewsRoutes);
apiRouter.use("/admin", adminRoutes);
