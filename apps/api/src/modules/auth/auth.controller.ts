import type { Request, Response } from "express";

import { sendCreated, sendSuccess } from "../../utils/response.js";
import {
  clearRefreshCookie,
  setRefreshCookie,
  getRefreshTokenFromRequest,
} from "./auth.middleware.js";
import {
  forgotPasswordSchema,
  loginSchema,
  registerArtisanSchema,
  registerCitizenSchema,
  resetPasswordSchema,
  verifyOtpSchema,
} from "./auth.schemas.js";
import { authService } from "./auth.service.js";

export class AuthController {
  registerCitizen = async (req: Request, res: Response): Promise<void> => {
    const input = registerCitizenSchema.parse(req.body);
    const result = await authService.registerCitizen(input);
    sendCreated(res, result);
  };

  registerArtisan = async (req: Request, res: Response): Promise<void> => {
    const input = registerArtisanSchema.parse(req.body);
    const files = req.files as {
      cinDocument?: Express.Multer.File[];
      tradeLicense?: Express.Multer.File[];
    };
    const result = await authService.registerArtisan(input, files ?? {});
    sendCreated(res, result);
  };

  verifyOtp = async (req: Request, res: Response): Promise<void> => {
    const input = verifyOtpSchema.parse(req.body);
    const result = await authService.verifyOtp(input);

    if (result.refreshToken) {
      setRefreshCookie(res, result.refreshToken);
    }

    sendSuccess(res, {
      user: result.user,
      accessToken: result.accessToken,
      expiresIn: result.expiresIn,
      ...(result.refreshToken ? { refreshToken: result.refreshToken } : {}),
    });
  };

  login = async (req: Request, res: Response): Promise<void> => {
    const input = loginSchema.parse(req.body);
    const result = await authService.login(input);
    if (result.refreshToken) {
      setRefreshCookie(res, result.refreshToken);
    }
    sendSuccess(res, {
      user: result.user,
      accessToken: result.accessToken,
      expiresIn: result.expiresIn,
    });
  };

  refresh = async (req: Request, res: Response): Promise<void> => {
    const refreshToken = getRefreshTokenFromRequest(req);
    if (!refreshToken) {
      res.status(401).json({
        success: false,
        error: { code: "UNAUTHORIZED", message: "Refresh token manquant" },
      });
      return;
    }

    const result = await authService.refresh(refreshToken);
    if (result.refreshToken) {
      setRefreshCookie(res, result.refreshToken);
    }
    sendSuccess(res, {
      accessToken: result.accessToken,
      expiresIn: result.expiresIn,
      user: result.user,
      ...(result.refreshToken ? { refreshToken: result.refreshToken } : {}),
    });
  };

  logout = async (req: Request, res: Response): Promise<void> => {
    const refreshToken = getRefreshTokenFromRequest(req);
    await authService.logout(refreshToken);
    clearRefreshCookie(res);
    sendSuccess(res, { message: "Déconnexion réussie" });
  };

  forgotPassword = async (req: Request, res: Response): Promise<void> => {
    const input = forgotPasswordSchema.parse(req.body);
    const result = await authService.forgotPassword(input);
    sendSuccess(res, result);
  };

  resetPassword = async (req: Request, res: Response): Promise<void> => {
    const input = resetPasswordSchema.parse(req.body);
    const result = await authService.resetPassword(input);
    sendSuccess(res, result);
  };

  me = async (req: Request, res: Response): Promise<void> => {
    const user = await authService.getMe(req.user!.id);
    sendSuccess(res, user);
  };
}

export const authController = new AuthController();
