import { Worker } from "bullmq";
import { Redis } from "ioredis";

import { env } from "../config/env.js";
import { prisma } from "../config/db.js";
import { logger } from "../utils/logger.js";
import type { PayoutJobData } from "./payoutQueue.js";

let worker: Worker<PayoutJobData> | null = null;

export function startPayoutWorker(): Worker<PayoutJobData> {
  if (worker) return worker;

  const connection = new Redis(env.REDIS_URL, { maxRetriesPerRequest: null });

  worker = new Worker<PayoutJobData>(
    "payout",
    async (job) => {
      const { payoutId } = job.data;
      await prisma.payout.update({
        where: { id: payoutId },
        data: { status: "DONE", processedAt: new Date() },
      });
      logger.info("Payout processed", { payoutId, artisanId: job.data.artisanId });
    },
    { connection },
  );

  worker.on("failed", (job, err) => {
    if (job?.data.payoutId) {
      void prisma.payout.update({
        where: { id: job.data.payoutId },
        data: { status: "FAILED" },
      });
    }
  });

  logger.info("Payout worker started");
  return worker;
}

export async function closePayoutWorker(): Promise<void> {
  if (worker) {
    await worker.close();
    worker = null;
  }
}
