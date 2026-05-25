import type { Request, Response } from "express";

import { getParam } from "../../utils/params.js";
import { sendCreated, sendSuccess } from "../../utils/response.js";
import { artisansService } from "../artisans/artisans.service.js";
import { paymentsAdminService } from "./payments.admin.service.js";
import { paymentsService } from "./payments.service.js";
import { walletService } from "./payments.wallet.js";

function idempotencyKey(req: Request): string | undefined {
  const key = req.headers["idempotency-key"];
  return typeof key === "string" ? key : undefined;
}

export class PaymentsController {
  initiate = async (req: Request, res: Response): Promise<void> => {
    const result = await paymentsService.initiatePayment(
      req.user!.id,
      req.body,
      idempotencyKey(req),
    );
    sendCreated(res, result);
  };

  listMy = async (req: Request, res: Response): Promise<void> => {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 20);
    const data = await paymentsService.listCitizenPayments(req.user!.id, page, limit);
    sendSuccess(res, data);
  };

  topup = async (req: Request, res: Response): Promise<void> => {
    const balance = await paymentsService.topupWallet(
      req.user!.id,
      req.body,
      idempotencyKey(req),
    );
    sendSuccess(res, balance);
  };

  cmiCallback = async (req: Request, res: Response): Promise<void> => {
    const params = req.body as Record<string, string>;
    await paymentsService.handleCmiCallback(params);
    res.status(200).send("OK");
  };

  walletBalance = async (req: Request, res: Response): Promise<void> => {
    const artisanId = req.user!.artisanId;
    if (!artisanId) {
      res.status(403).json({ error: "Profil artisan requis" });
      return;
    }
    const balance = await walletService.getBalance(artisanId);
    sendSuccess(res, balance);
  };

  walletPayout = async (req: Request, res: Response): Promise<void> => {
    const payout = await artisansService.requestPayout(req.user!.id, req.body);
    sendCreated(res, payout);
  };

  walletTransactions = async (req: Request, res: Response): Promise<void> => {
    const artisanId = req.user!.artisanId;
    if (!artisanId) {
      res.status(403).json({ error: "Profil artisan requis" });
      return;
    }
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 30);
    const data = await walletService.listTransactions(artisanId, page, limit);
    sendSuccess(res, data);
  };

  adminCreatePayout = async (req: Request, res: Response): Promise<void> => {
    const result = await paymentsAdminService.createPayout(req.user!.id, req.body);
    sendCreated(res, result);
  };

  adminBatchPayout = async (req: Request, res: Response): Promise<void> => {
    const result = await paymentsAdminService.createBatchPayouts(req.user!.id, req.body);
    sendCreated(res, result);
  };

  adminListPayouts = async (req: Request, res: Response): Promise<void> => {
    const data = await paymentsAdminService.listPayouts({
      page: Number(req.query.page ?? 1),
      limit: Number(req.query.limit ?? 50),
      status: req.query.status as string | undefined,
    });
    sendSuccess(res, data);
  };

  adminProcessPendingPayouts = async (req: Request, res: Response): Promise<void> => {
    const result = await paymentsAdminService.processPendingPayoutsBatch(req.user!.id);
    sendSuccess(res, result);
  };

  adminInitiateRefund = async (req: Request, res: Response): Promise<void> => {
    const refund = await paymentsAdminService.initiateRefund(
      getParam(req, "paymentId"),
      req.user!.id,
      req.body,
    );
    sendCreated(res, refund);
  };

  adminExecuteRefund = async (req: Request, res: Response): Promise<void> => {
    const result = await paymentsAdminService.executeRefund(
      getParam(req, "paymentId"),
      req.user!.id,
      req.body,
    );
    sendSuccess(res, result);
  };
}

export const paymentsController = new PaymentsController();
