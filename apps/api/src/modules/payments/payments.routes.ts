import { Router, type IRouter } from "express";

import { authenticate, authorize } from "../../middleware/auth.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { paymentsController } from "./payments.controller.js";

export const paymentsRoutes: IRouter = Router();

paymentsRoutes.use(authenticate);

paymentsRoutes.post("/initiate", authorize("CITIZEN"), asyncHandler(paymentsController.initiate));
paymentsRoutes.get("/my", authorize("CITIZEN"), asyncHandler(paymentsController.listMy));
paymentsRoutes.post("/wallet/topup", authorize("CITIZEN"), asyncHandler(paymentsController.topup));

export const walletRoutes: IRouter = Router();
walletRoutes.use(authenticate);
walletRoutes.get(
  "/balance",
  authorize("ARTISAN"),
  asyncHandler(paymentsController.walletBalance),
);
walletRoutes.get("/transactions", asyncHandler(paymentsController.walletTransactions));
walletRoutes.post("/payout", authorize("ARTISAN"), asyncHandler(paymentsController.walletPayout));

export const paymentsAdminRoutes: IRouter = Router();
paymentsAdminRoutes.use(authenticate, authorize("ADMIN"));
paymentsAdminRoutes.post("/payouts", asyncHandler(paymentsController.adminCreatePayout));
paymentsAdminRoutes.post("/payouts/batch", asyncHandler(paymentsController.adminBatchPayout));
paymentsAdminRoutes.post("/payouts/batch-pending", asyncHandler(paymentsController.adminProcessPendingPayouts));
paymentsAdminRoutes.get("/payouts", asyncHandler(paymentsController.adminListPayouts));
paymentsAdminRoutes.post(
  "/payments/:paymentId/refund/initiate",
  asyncHandler(paymentsController.adminInitiateRefund),
);
paymentsAdminRoutes.post(
  "/payments/:paymentId/refund/execute",
  asyncHandler(paymentsController.adminExecuteRefund),
);
