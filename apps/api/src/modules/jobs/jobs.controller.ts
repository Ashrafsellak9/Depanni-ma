import type { Request, Response } from "express";

import { getParam } from "../../utils/params.js";
import { sendCreated, sendSuccess } from "../../utils/response.js";
import { jobsService } from "./jobs.service.js";

export class JobsController {
  list = async (req: Request, res: Response): Promise<void> => {
    const { jobs, meta } = await jobsService.list(req.query);
    sendSuccess(res, jobs, 200, meta);
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    const job = await jobsService.getById(getParam(req, "id"));
    sendSuccess(res, job);
  };

  create = async (req: Request, res: Response): Promise<void> => {
    const job = await jobsService.create(req.user!.id, req.body);
    sendCreated(res, job);
  };
}

export const jobsController = new JobsController();
