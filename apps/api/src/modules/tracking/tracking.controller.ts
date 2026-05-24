import type { Request, Response } from "express";
import { z } from "zod";

import { getParam } from "../../utils/params.js";
import { sendSuccess } from "../../utils/response.js";
import { trackingService } from "./tracking.service.js";

const locationSchema = z.object({
  lat: z.number(),
  lng: z.number(),
});

export class TrackingController {
  updateLocation = async (req: Request, res: Response): Promise<void> => {
    const { lat, lng } = locationSchema.parse(req.body);
    const artisan = await trackingService.updateLocation(getParam(req, "artisanId"), lat, lng);
    sendSuccess(res, artisan);
  };

  getLocation = async (req: Request, res: Response): Promise<void> => {
    const location = await trackingService.getLocation(getParam(req, "artisanId"));
    sendSuccess(res, location);
  };

  getEta = async (req: Request, res: Response): Promise<void> => {
    const origin = locationSchema.parse(req.body.origin);
    const destination = locationSchema.parse(req.body.destination);
    const eta = await trackingService.getEta(origin, destination);
    sendSuccess(res, eta);
  };
}

export const trackingController = new TrackingController();
