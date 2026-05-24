import type { Request, Response } from "express";

import { getParam } from "../../utils/params.js";
import { sendSuccess } from "../../utils/response.js";
import { usersService } from "./users.service.js";

export class UsersController {
  getMe = async (req: Request, res: Response): Promise<void> => {
    const user = await usersService.getById(req.user!.id);
    sendSuccess(res, user);
  };

  updateMe = async (req: Request, res: Response): Promise<void> => {
    const user = await usersService.updateProfile(req.user!.id, req.body);
    sendSuccess(res, user);
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    const user = await usersService.getById(getParam(req, "id"));
    sendSuccess(res, user);
  };
}

export const usersController = new UsersController();
