import type { Request, Response } from "express";

import { AuthRefreshSchema } from "@depanni/validators";

import { sendCreated, sendSuccess } from "../../utils/response.js";
import { authService } from "./auth.service.js";
import type { LoginDto, RegisterDto } from "./auth.types.js";

export class AuthController {
  register = async (req: Request, res: Response): Promise<void> => {
    const result = await authService.register(req.body as RegisterDto);
    sendCreated(res, result);
  };

  login = async (req: Request, res: Response): Promise<void> => {
    const result = await authService.login(req.body as LoginDto);
    sendSuccess(res, result);
  };

  refresh = async (req: Request, res: Response): Promise<void> => {
    const { refreshToken } = AuthRefreshSchema.parse(req.body);
    const tokens = await authService.refresh(refreshToken);
    sendSuccess(res, tokens);
  };

  me = async (req: Request, res: Response): Promise<void> => {
    sendSuccess(res, { user: req.user });
  };
}

export const authController = new AuthController();
