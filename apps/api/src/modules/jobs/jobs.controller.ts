import type { Request, Response } from "express";

import { getCitizenIdByUserId } from "../../utils/profile.js";
import { getParam } from "../../utils/params.js";
import { sendCreated, sendSuccess } from "../../utils/response.js";
import { jobsService } from "./jobs.service.js";

export class JobsController {
  create = async (req: Request, res: Response): Promise<void> => {
    const citizenId = await getCitizenIdByUserId(req.user!.id);
    const photos = req.files as Express.Multer.File[] | undefined;
    const job = await jobsService.create(citizenId, req.body, photos);
    sendCreated(res, job);
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    const job = await jobsService.getById(
      getParam(req, "id"),
      req.user?.id,
      req.user?.role,
    );
    sendSuccess(res, job);
  };

  listMy = async (req: Request, res: Response): Promise<void> => {
    const citizenId = await getCitizenIdByUserId(req.user!.id);
    const result = await jobsService.listMy(citizenId, req.query);
    sendSuccess(res, result);
  };

  cancel = async (req: Request, res: Response): Promise<void> => {
    const citizenId = await getCitizenIdByUserId(req.user!.id);
    const job = await jobsService.cancel(getParam(req, "id"), citizenId);
    sendSuccess(res, job);
  };

  listActive = async (req: Request, res: Response): Promise<void> => {
    const jobs = await jobsService.listActiveForArtisan(req.user!.id, req.query);
    sendSuccess(res, jobs);
  };

  createOffer = async (req: Request, res: Response): Promise<void> => {
    const offer = await jobsService.createOffer(
      getParam(req, "jobId"),
      req.user!.id,
      req.user!.artisanId,
      req.body,
    );
    sendCreated(res, offer);
  };

  listOffers = async (req: Request, res: Response): Promise<void> => {
    const offers = await jobsService.listOffers(
      getParam(req, "jobId"),
      req.user!.id,
      req.user!.role,
    );
    sendSuccess(res, offers);
  };

  acceptOffer = async (req: Request, res: Response): Promise<void> => {
    const citizenId = await getCitizenIdByUserId(req.user!.id);
    const result = await jobsService.acceptOffer(
      getParam(req, "jobId"),
      getParam(req, "offerId"),
      citizenId,
    );
    sendSuccess(res, result);
  };

  rejectOffer = async (req: Request, res: Response): Promise<void> => {
    const citizenId = await getCitizenIdByUserId(req.user!.id);
    const offer = await jobsService.rejectOffer(
      getParam(req, "jobId"),
      getParam(req, "offerId"),
      citizenId,
    );
    sendSuccess(res, offer);
  };

  completeOffer = async (req: Request, res: Response): Promise<void> => {
    const result = await jobsService.completeOffer(
      getParam(req, "jobId"),
      getParam(req, "offerId"),
      req.user!.id,
      req.user!.role,
    );
    sendSuccess(res, result);
  };
}

export const jobsController = new JobsController();
