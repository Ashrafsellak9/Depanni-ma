import type { Request, Response } from "express";

import { getParam } from "../../utils/params.js";
import { sendSuccess } from "../../utils/response.js";
import { usersService } from "./users.service.js";

export class UsersController {
  getMe = async (req: Request, res: Response): Promise<void> => {
    const user = await usersService.getMe(req.user!.id);
    sendSuccess(res, user);
  };

  updateMe = async (req: Request, res: Response): Promise<void> => {
    const user = await usersService.updateMe(req.user!.id, req.body);
    sendSuccess(res, user);
  };

  addAddress = async (req: Request, res: Response): Promise<void> => {
    const address = await usersService.addAddress(req.user!.id, req.body);
    sendSuccess(res, address, 201);
  };

  deleteAddress = async (req: Request, res: Response): Promise<void> => {
    const result = await usersService.deleteAddress(req.user!.id, getParam(req, "id"));
    sendSuccess(res, result);
  };

  getHistory = async (req: Request, res: Response): Promise<void> => {
    const history = await usersService.getHistory(req.user!.id, req.query);
    sendSuccess(res, history);
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    const user = await usersService.getById(getParam(req, "id"), req.user?.id);
    sendSuccess(res, user);
  };
}

export const usersController = new UsersController();
