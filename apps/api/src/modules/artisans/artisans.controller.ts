import type { Request, Response } from "express";

import { getParam } from "../../utils/params.js";
import { sendCreated, sendSuccess } from "../../utils/response.js";
import { artisansService } from "./artisans.service.js";

export class ArtisansController {
  getMe = async (req: Request, res: Response): Promise<void> => {
    const profile = await artisansService.getMe(req.user!.id);
    sendSuccess(res, profile);
  };

  updateMe = async (req: Request, res: Response): Promise<void> => {
    const profile = await artisansService.updateMe(req.user!.id, req.body);
    sendSuccess(res, profile);
  };

  setAvailability = async (req: Request, res: Response): Promise<void> => {
    const result = await artisansService.setAvailability(req.user!.id, req.body);
    sendSuccess(res, result);
  };

  updateLocation = async (req: Request, res: Response): Promise<void> => {
    const result = await artisansService.updateLocation(req.user!.id, req.body);
    sendSuccess(res, result);
  };

  getEarnings = async (req: Request, res: Response): Promise<void> => {
    const earnings = await artisansService.getEarnings(req.user!.id, req.query);
    sendSuccess(res, earnings);
  };

  listMissions = async (req: Request, res: Response): Promise<void> => {
    const result = await artisansService.listMissions(req.user!.id, req.query);
    sendSuccess(res, result);
  };

  getMission = async (req: Request, res: Response): Promise<void> => {
    const mission = await artisansService.getMissionById(
      req.user!.id,
      getParam(req, "missionId"),
    );
    sendSuccess(res, mission);
  };

  requestPayout = async (req: Request, res: Response): Promise<void> => {
    const payout = await artisansService.requestPayout(req.user!.id, req.body);
    sendCreated(res, payout);
  };

  upgradeSubscription = async (req: Request, res: Response): Promise<void> => {
    const result = await artisansService.upgradeSubscription(req.user!.id, req.body);
    sendSuccess(res, result);
  };

  uploadKyc = async (req: Request, res: Response): Promise<void> => {
    const files = req.files as {
      cinRecto?: Express.Multer.File[];
      cinVerso?: Express.Multer.File[];
      diploma?: Express.Multer.File[];
    };
    const result = await artisansService.uploadKyc(req.user!.id, files);
    sendSuccess(res, result, 201);
  };

  getNearby = async (req: Request, res: Response): Promise<void> => {
    const artisans = await artisansService.findNearby(req.query);
    sendSuccess(res, artisans);
  };

  getPublicProfile = async (req: Request, res: Response): Promise<void> => {
    const profile = await artisansService.getPublicProfile(getParam(req, "id"));
    sendSuccess(res, profile);
  };
}

export const artisansController = new ArtisansController();
