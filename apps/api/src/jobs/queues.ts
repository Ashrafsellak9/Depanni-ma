import { Queue } from "bullmq";
import { Redis } from "ioredis";

import { env } from "../config/env.js";

function createBullConnection(): Redis {
  return new Redis(env.REDIS_URL, { maxRetriesPerRequest: null });
}

const connection = createBullConnection();

export const emailQueue = new Queue("email", { connection });
export const smsQueue = new Queue("sms", { connection });
export const payoutQueue = new Queue("payout", { connection });
export const pdfQueue = new Queue("pdf", { connection });

export async function closeQueues(): Promise<void> {
  await Promise.all([
    emailQueue.close(),
    smsQueue.close(),
    payoutQueue.close(),
    pdfQueue.close(),
  ]);
  await connection.quit();
}
