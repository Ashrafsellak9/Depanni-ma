import type { Request, Response } from "express";

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
}

export const adminController = new AdminController();
