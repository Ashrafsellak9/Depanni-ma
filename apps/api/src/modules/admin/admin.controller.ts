import type { Request, Response } from "express";

import { getParam } from "../../utils/params.js";
import { sendSuccess } from "../../utils/response.js";
import { adminService } from "./admin.service.js";

export class AdminController {
  dashboard = async (_req: Request, res: Response): Promise<void> => {
    const stats = await adminService.getDashboardStats();
    sendSuccess(res, stats);
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
