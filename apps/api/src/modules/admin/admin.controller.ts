import type { Request, Response } from "express";

import { getParam } from "../../utils/params.js";
import { sendSuccess } from "../../utils/response.js";
import { adminService } from "./admin.service.js";

export class AdminController {
  dashboard = async (_req: Request, res: Response): Promise<void> => {
    const stats = await adminService.getDashboardStats();
    sendSuccess(res, stats);
  };

  overview = async (_req: Request, res: Response): Promise<void> => {
    const data = await adminService.getOverview();
    sendSuccess(res, data);
  };

  listMissions = async (req: Request, res: Response): Promise<void> => {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 20);
    const data = await adminService.listMissions({
      status: req.query.status as string | undefined,
      search: req.query.search as string | undefined,
      page,
      limit,
    });
    sendSuccess(res, data);
  };

  getMission = async (req: Request, res: Response): Promise<void> => {
    const mission = await adminService.getMission(getParam(req, "id"));
    sendSuccess(res, mission);
  };

  listArtisans = async (req: Request, res: Response): Promise<void> => {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 20);
    const data = await adminService.listArtisans({
      kyc: req.query.kyc as string | undefined,
      page,
      limit,
    });
    sendSuccess(res, data);
  };

  getArtisan = async (req: Request, res: Response): Promise<void> => {
    const artisan = await adminService.getArtisan(getParam(req, "id"));
    sendSuccess(res, artisan);
  };

  listUsers = async (req: Request, res: Response): Promise<void> => {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 20);
    const users = await adminService.listUsers(page, limit);
    sendSuccess(res, users);
  };

  listKycPending = async (req: Request, res: Response): Promise<void> => {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 20);
    const result = await adminService.listKycPending(page, limit);
    sendSuccess(res, result);
  };

  listCitizens = async (req: Request, res: Response): Promise<void> => {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 20);
    const data = await adminService.listCitizens(page, limit);
    sendSuccess(res, data);
  };

  approveKyc = async (req: Request, res: Response): Promise<void> => {
    const artisan = await adminService.approveKyc(getParam(req, "id"));
    sendSuccess(res, artisan);
  };

  rejectKyc = async (req: Request, res: Response): Promise<void> => {
    const artisan = await adminService.rejectKyc(getParam(req, "id"), req.body);
    sendSuccess(res, artisan);
  };
}

export const adminController = new AdminController();
