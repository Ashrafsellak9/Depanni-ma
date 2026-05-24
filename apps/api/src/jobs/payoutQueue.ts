import { payoutQueue } from "./queues.js";

export interface PayoutJobData {
  payoutId: string;
  artisanId: string;
  amount: number;
  currency: string;
}

export async function enqueuePayout(data: PayoutJobData): Promise<void> {
  await payoutQueue.add("process", data, {
    attempts: 5,
    backoff: { type: "fixed", delay: 10_000 },
  });
}
