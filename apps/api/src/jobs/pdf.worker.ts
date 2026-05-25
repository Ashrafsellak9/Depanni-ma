import { Worker } from "bullmq";
import { Redis } from "ioredis";

import { env } from "../config/env.js";
import { enqueueEmail } from "./emailQueue.js";
import { logger } from "../utils/logger.js";
import type { PdfJobData } from "./pdfQueue.js";

let worker: Worker<PdfJobData> | null = null;

export function startPdfWorker(): Worker<PdfJobData> {
  if (worker) return worker;

  const connection = new Redis(env.REDIS_URL, { maxRetriesPerRequest: null });

  worker = new Worker<PdfJobData>(
    "pdf",
    async (job) => {
      const { type, emailTo } = job.data;
      logger.info("PDF job processed", { type, jobId: job.id });
      if (emailTo) {
        await enqueueEmail({
          to: emailTo,
          subject: `DEPANNI — rapport ${type}`,
          html: `<p>Votre document ${type} est prêt.</p>`,
        });
      }
    },
    { connection, concurrency: 2 },
  );

  worker.on("failed", (job, err) => {
    logger.error("PDF job failed", { jobId: job?.id, err: err.message });
  });

  logger.info("PDF worker started");
  return worker;
}

export async function closePdfWorker(): Promise<void> {
  if (worker) {
    await worker.close();
    worker = null;
  }
}
