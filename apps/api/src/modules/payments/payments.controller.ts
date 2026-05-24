import type { Request, Response } from "express";

import { getParam } from "../../utils/params.js";
import { sendCreated, sendSuccess } from "../../utils/response.js";
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
    const balance = await walletService.getBalance(req.user!.id);
    sendSuccess(res, balance);
  };

  walletTransactions = async (req: Request, res: Response): Promise<void> => {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 30);
    const data = await walletService.listTransactions(req.user!.id, page, limit);
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
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 20);
    const data = await paymentsAdminService.listPayouts(page, limit);
    sendSuccess(res, data);
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
    const refund = await paymentsAdminService.executeRefund(
      getParam(req, "refundId"),
      req.user!.id,
    );
    sendSuccess(res, refund);
  };
}

export const paymentsController = new PaymentsController();
