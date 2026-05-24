import type { Request, Response } from "express";
import { z } from "zod";

import { sendCreated, sendSuccess } from "../../utils/response.js";
import { paymentsService } from "./payments.service.js";

const intentSchema = z.object({
  amount: z.number().positive(),
  currency: z.string().default("mad"),
});

export class PaymentsController {
  createIntent = async (req: Request, res: Response): Promise<void> => {
    const { amount, currency } = intentSchema.parse(req.body);
    const result = await paymentsService.createPaymentIntent(amount, currency);
    sendCreated(res, result);
  };

  webhook = async (req: Request, res: Response): Promise<void> => {
    const signature = req.headers["stripe-signature"] as string;
    await paymentsService.handleWebhook(req.body as Buffer, signature);
    sendSuccess(res, { received: true });
  };
}

export const paymentsController = new PaymentsController();
