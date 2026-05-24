import type { Request, Response } from "express";

import { getParam } from "../../utils/params.js";
import { sendCreated, sendSuccess } from "../../utils/response.js";
import { offersService } from "./offers.service.js";

/** @deprecated Préférer les routes imbriquées /api/jobs/:jobId/offers */
export class OffersController {
  create = async (req: Request, res: Response): Promise<void> => {
    const offer = await offersService.create(
      req.body.jobId as string,
      req.user!.id,
      req.user!.artisanId,
      req.body,
    );
    sendCreated(res, offer);
  };

  listByJob = async (req: Request, res: Response): Promise<void> => {
    const offers = await offersService.listByJob(
      getParam(req, "jobId"),
      req.user!.id,
      req.user!.role,
    );
    sendSuccess(res, offers);
  };
}

export const offersController = new OffersController();
