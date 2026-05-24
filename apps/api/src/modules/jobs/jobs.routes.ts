import { Router, type IRouter } from "express";

import { authenticate, authorize } from "../../middleware/auth.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { jobsController } from "./jobs.controller.js";
import { jobPhotosUpload } from "./jobs.middleware.js";

export const jobsRoutes: IRouter = Router();

jobsRoutes.use(authenticate);

// Routes statiques avant :id
jobsRoutes.get("/my", authorize("CITIZEN"), asyncHandler(jobsController.listMy));
jobsRoutes.get("/active", authorize("ARTISAN"), asyncHandler(jobsController.listActive));

jobsRoutes.post(
  "/",
  authorize("CITIZEN"),
  jobPhotosUpload,
  asyncHandler(jobsController.create),
);

jobsRoutes.get("/:id", asyncHandler(jobsController.getById));
jobsRoutes.patch("/:id/cancel", authorize("CITIZEN"), asyncHandler(jobsController.cancel));

// Offres imbriquées
jobsRoutes.post(
  "/:jobId/offers",
  authorize("ARTISAN"),
  asyncHandler(jobsController.createOffer),
);
jobsRoutes.get("/:jobId/offers", asyncHandler(jobsController.listOffers));
jobsRoutes.post(
  "/:jobId/offers/:offerId/accept",
  authorize("CITIZEN"),
  asyncHandler(jobsController.acceptOffer),
);
jobsRoutes.post(
  "/:jobId/offers/:offerId/reject",
  authorize("CITIZEN"),
  asyncHandler(jobsController.rejectOffer),
);
jobsRoutes.patch(
  "/:jobId/offers/:offerId/complete",
  asyncHandler(jobsController.completeOffer),
);
