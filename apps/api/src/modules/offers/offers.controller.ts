import type { Request, Response } from "express";

import { getParam } from "../../utils/params.js";
import { sendCreated, sendSuccess } from "../../utils/response.js";
import { offersService } from "./offers.service.js";

export class OffersController {
  create = async (req: Request, res: Response): Promise<void> => {
    const offer = await offersService.create(req.user!.id, req.body);
    sendCreated(res, offer);
  };

  listByJob = async (req: Request, res: Response): Promise<void> => {
    const offers = await offersService.listByJob(getParam(req, "jobId"));
    sendSuccess(res, offers);
  };
}

export const offersController = new OffersController();
