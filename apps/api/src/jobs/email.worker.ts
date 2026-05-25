import { Worker } from "bullmq";
import { Redis } from "ioredis";

import { env } from "../config/env.js";
import { logger } from "../utils/logger.js";
import type { EmailJobData } from "./emailQueue.js";

let worker: Worker<EmailJobData> | null = null;

export function startEmailWorker(): Worker<EmailJobData> {
  if (worker) return worker;

  const connection = new Redis(env.REDIS_URL, { maxRetriesPerRequest: null });

  worker = new Worker<EmailJobData>(
    "email",
    async (job) => {
      const { to, subject } = job.data;
      // SMTP provider can be wired here; log in dev until configured
      logger.info("Email job processed", { to, subject, jobId: job.id });
    },
    { connection, concurrency: 5 },
  );

  worker.on("failed", (job, err) => {
    logger.error("Email job failed", { jobId: job?.id, err: err.message });
  });

  logger.info("Email worker started");
  return worker;
}

export async function closeEmailWorker(): Promise<void> {
  if (worker) {
    await worker.close();
    worker = null;
  }
}
