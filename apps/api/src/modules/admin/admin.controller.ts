import type { Request, Response } from "express";

import { getParam } from "../../utils/params.js";
import { sendSuccess } from "../../utils/response.js";
import { artisansListSchema } from "./admin.schemas.js";
import * as disputes from "./admin.disputes.js";
import { adminService } from "./admin.service.js";

export class AdminController {
  dashboard = async (_req: Request, res: Response): Promise<void> => {
    sendSuccess(res, await adminService.getDashboardStats());
  };

  overview = async (_req: Request, res: Response): Promise<void> => {
    sendSuccess(res, await adminService.getOverview());
  };

  listMissions = async (req: Request, res: Response): Promise<void> => {
    sendSuccess(
      res,
      await adminService.listMissions({
        status: req.query.status as string | undefined,
        search: req.query.search as string | undefined,
        page: Number(req.query.page ?? 1),
        limit: Number(req.query.limit ?? 20),
      }),
    );
  };

  getMission = async (req: Request, res: Response): Promise<void> => {
    sendSuccess(res, await adminService.getMission(getParam(req, "id")));
  };

  listArtisans = async (req: Request, res: Response): Promise<void> => {
    const query = artisansListSchema.parse(req.query);
    sendSuccess(res, await adminService.listArtisans(query));
  };

  getArtisan = async (req: Request, res: Response): Promise<void> => {
    sendSuccess(res, await adminService.getArtisan(getParam(req, "id")));
  };

  kycStats = async (_req: Request, res: Response): Promise<void> => {
    sendSuccess(res, await adminService.getKycStats());
  };

  listUsers = async (req: Request, res: Response): Promise<void> => {
    sendSuccess(
      res,
      await adminService.listUsers(Number(req.query.page ?? 1), Number(req.query.limit ?? 20)),
    );
  };

  listKycPending = async (req: Request, res: Response): Promise<void> => {
    sendSuccess(
      res,
      await adminService.listKycPending(
        Number(req.query.page ?? 1),
        Number(req.query.limit ?? 20),
      ),
    );
  };

  listCitizens = async (req: Request, res: Response): Promise<void> => {
    sendSuccess(
      res,
      await adminService.listCitizens(Number(req.query.page ?? 1), Number(req.query.limit ?? 20)),
    );
  };

  approveKyc = async (req: Request, res: Response): Promise<void> => {
    sendSuccess(res, await adminService.approveKyc(getParam(req, "id"), req.user!.id));
  };

  rejectKyc = async (req: Request, res: Response): Promise<void> => {
    sendSuccess(res, await adminService.rejectKyc(getParam(req, "id"), req.user!.id, req.body));
  };

  suspendArtisan = async (req: Request, res: Response): Promise<void> => {
    sendSuccess(res, await adminService.suspendArtisan(getParam(req, "id"), req.user!.id, req.body));
  };

  banArtisan = async (req: Request, res: Response): Promise<void> => {
    sendSuccess(res, await adminService.banArtisan(getParam(req, "id"), req.user!.id, req.body));
  };

  reactivateArtisan = async (req: Request, res: Response): Promise<void> => {
    sendSuccess(res, await adminService.reactivateArtisan(getParam(req, "id"), req.user!.id));
  };

  upgradeSubscription = async (req: Request, res: Response): Promise<void> => {
    sendSuccess(
      res,
      await adminService.upgradeArtisanSubscription(getParam(req, "id"), req.user!.id, req.body),
    );
  };

  resetRating = async (req: Request, res: Response): Promise<void> => {
    sendSuccess(res, await adminService.resetArtisanRating(getParam(req, "id"), req.user!.id));
  };

  sendArtisanMessage = async (req: Request, res: Response): Promise<void> => {
    sendSuccess(res, await adminService.sendArtisanMessage(getParam(req, "id"), req.user!.id, req.body));
  };

  listDisputes = async (_req: Request, res: Response): Promise<void> => {
    sendSuccess(res, await disputes.listDisputes());
  };

  getDispute = async (req: Request, res: Response): Promise<void> => {
    sendSuccess(res, await disputes.getDispute(getParam(req, "id")));
  };

  resolveDispute = async (req: Request, res: Response): Promise<void> => {
    const { resolveDisputeSchema } = await import("./admin.schemas.js");
    const input = resolveDisputeSchema.parse(req.body);
    sendSuccess(res, await disputes.resolveDispute(getParam(req, "id"), req.user!.id, input));
  };
}

export const adminController = new AdminController();
