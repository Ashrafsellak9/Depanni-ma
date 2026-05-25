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
  getMissionTracking = async (req: Request, res: Response): Promise<void> => {
    const data = await trackingService.getMissionTracking(
      getParam(req, "missionId"),
      req.user!.id,
      req.user!.role,
    );
    sendSuccess(res, data);
  };

  /** @deprecated Utiliser Socket /tracking + GET missions/:missionId */
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

  postPosition = async (req: Request, res: Response): Promise<void> => {
    const body = { ...req.body, missionId: getParam(req, "missionId") };
    const result = await trackingService.updateMissionPosition(
      req.user!.id,
      req.user!.artisanId,
      body,
    );
    sendSuccess(res, result);
  };

  postArrived = async (req: Request, res: Response): Promise<void> => {
    const position = await trackingService.forceArrived(
      getParam(req, "missionId"),
      req.user!.id,
    );
    sendSuccess(res, { arrived: true, position });
  };

  postStart = async (req: Request, res: Response): Promise<void> => {
    await trackingService.markTrackingStarted(getParam(req, "missionId"), req.user!.id);
    sendSuccess(res, { started: true });
  };
}

export const trackingController = new TrackingController();
