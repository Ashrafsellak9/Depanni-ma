import { z } from "zod";

export const initiatePaymentSchema = z.object({
  jobId: z.string().uuid(),
  method: z.enum(["CARD", "CASH", "WALLET"]),
  amount: z.coerce.number().positive().optional(),
  idempotencyKey: z.string().min(8).max(128).optional(),
});

export const topupWalletSchema = z.object({
  amount: z.coerce.number().positive().max(50_000),
  idempotencyKey: z.string().min(8).max(128).optional(),
});

export const adminPayoutSchema = z.object({
  artisanId: z.string().uuid(),
  amount: z.coerce.number().positive().optional(),
  reference: z.string().max(100).optional(),
});

export const adminBatchPayoutSchema = z.object({
  artisanIds: z.array(z.string().uuid()).min(1).max(100),
  reference: z.string().max(100).optional(),
});

export const adminRefundExecuteSchema = z.object({
  refundId: z.string().uuid(),
});

export type InitiatePaymentInput = z.infer<typeof initiatePaymentSchema>;
export type TopupWalletInput = z.infer<typeof topupWalletSchema>;
