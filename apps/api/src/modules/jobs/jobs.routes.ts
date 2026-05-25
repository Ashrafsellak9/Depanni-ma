import { Router, type IRouter } from "express";

import { authenticate, authorize } from "../../middleware/auth.js";
import { jobsCreateLimiter, offersCreateLimiter } from "../../middleware/rateLimiter.js";
import { validateBody, validateParams, validateQuery } from "../../middleware/validate.js";
import { jobIdParamSchema, offerIdParamSchema, uuidParamSchema } from "../../schemas/common.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { jobsController } from "./jobs.controller.js";
import {
  activeJobsQuerySchema,
  createOfferSchema,
  myJobsQuerySchema,
} from "./jobs.schemas.js";
import { jobPhotosUpload } from "./jobs.middleware.js";

export const jobsRoutes: IRouter = Router();

jobsRoutes.use(authenticate);

jobsRoutes.get(
  "/my",
  authorize("CITIZEN"),
  validateQuery(myJobsQuerySchema),
  asyncHandler(jobsController.listMy),
);
jobsRoutes.get(
  "/active",
  authorize("ARTISAN"),
  validateQuery(activeJobsQuerySchema),
  asyncHandler(jobsController.listActive),
);

jobsRoutes.post(
  "/",
  authorize("CITIZEN"),
  jobsCreateLimiter,
  ...jobPhotosUpload,
  asyncHandler(jobsController.create),
);

jobsRoutes.get("/:id", validateParams(uuidParamSchema), asyncHandler(jobsController.getById));
jobsRoutes.patch(
  "/:id/cancel",
  authorize("CITIZEN"),
  validateParams(uuidParamSchema),
  asyncHandler(jobsController.cancel),
);

jobsRoutes.post(
  "/:jobId/offers",
  authorize("ARTISAN"),
  offersCreateLimiter,
  validateParams(jobIdParamSchema),
  validateBody(createOfferSchema),
  asyncHandler(jobsController.createOffer),
);
jobsRoutes.get(
  "/:jobId/offers",
  validateParams(jobIdParamSchema),
  asyncHandler(jobsController.listOffers),
);
jobsRoutes.post(
  "/:jobId/offers/:offerId/accept",
  authorize("CITIZEN"),
  validateParams(offerIdParamSchema),
  asyncHandler(jobsController.acceptOffer),
);
jobsRoutes.post(
  "/:jobId/offers/:offerId/reject",
  authorize("CITIZEN"),
  validateParams(offerIdParamSchema),
  asyncHandler(jobsController.rejectOffer),
);
jobsRoutes.patch(
  "/:jobId/offers/:offerId/complete",
  validateParams(offerIdParamSchema),
  asyncHandler(jobsController.completeOffer),
);
