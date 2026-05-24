import type { Request, Response } from "express";

import { getParam } from "../../utils/params.js";
import { sendSuccess } from "../../utils/response.js";
import { artisansService } from "./artisans.service.js";

export class ArtisansController {
  getById = async (req: Request, res: Response): Promise<void> => {
    const artisan = await artisansService.getById(getParam(req, "id"));
    sendSuccess(res, artisan);
  };

  upsertProfile = async (req: Request, res: Response): Promise<void> => {
    const artisan = await artisansService.upsertProfile(req.user!.id, req.body);
    sendSuccess(res, artisan);
  };

  setAvailability = async (req: Request, res: Response): Promise<void> => {
    const { isAvailable } = req.body as { isAvailable: boolean };
    const artisan = await artisansService.setAvailability(req.user!.id, isAvailable);
    sendSuccess(res, artisan);
  };
}

export const artisansController = new ArtisansController();
