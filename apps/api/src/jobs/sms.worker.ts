import { Worker } from "bullmq";
import { Redis } from "ioredis";

import { env } from "../config/env.js";
import { notificationsService } from "../modules/notifications/notifications.service.js";
import { logger } from "../utils/logger.js";
import type { SmsJobData } from "./smsQueue.js";

let worker: Worker<SmsJobData> | null = null;

export function startSmsWorker(): Worker<SmsJobData> {
  if (worker) return worker;

  const connection = new Redis(env.REDIS_URL, { maxRetriesPerRequest: null });

  worker = new Worker<SmsJobData>(
    "sms",
    async (job) => {
      await notificationsService.sendSms(job.data.to, job.data.body);
    },
    { connection, concurrency: 10 },
  );

  worker.on("failed", (job, err) => {
    logger.error("SMS job failed", { jobId: job?.id, err: err.message });
  });

  logger.info("SMS worker started");
  return worker;
}

export async function closeSmsWorker(): Promise<void> {
  if (worker) {
    await worker.close();
    worker = null;
  }
}
