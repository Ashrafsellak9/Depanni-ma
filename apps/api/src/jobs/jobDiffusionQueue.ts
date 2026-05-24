import { Queue, Worker } from "bullmq";
import { Redis } from "ioredis";

import { env } from "../config/env.js";
import {
  expandDiffusionRadius,
  expireJobIfNeeded,
  type DiffusionJobPayload,
} from "../modules/jobs/jobs.diffusion.js";
import { logger } from "../utils/logger.js";

function createConnection(): Redis {
  return new Redis(env.REDIS_URL, { maxRetriesPerRequest: null });
}

const connection = createConnection();

export const jobDiffusionQueue = new Queue<DiffusionJobPayload>("job-diffusion", {
  connection,
});

let worker: Worker<DiffusionJobPayload> | null = null;

export function startJobDiffusionWorker(): Worker<DiffusionJobPayload> {
  if (worker) return worker;

  worker = new Worker<DiffusionJobPayload>(
    "job-diffusion",
    async (job) => {
      const { jobId, action, targetRadiusKm } = job.data;
      if (action === "expand" && targetRadiusKm) {
        await expandDiffusionRadius(jobId, targetRadiusKm);
        return;
      }
      if (action === "expire") {
        await expireJobIfNeeded(jobId);
      }
    },
    { connection: createConnection() },
  );

  worker.on("failed", (job, err) => {
    logger.error("Job diffusion worker failed", {
      jobId: job?.data.jobId,
      err: err.message,
    });
  });

  logger.info("Job diffusion worker started");
  return worker;
}

export async function closeJobDiffusionQueue(): Promise<void> {
  if (worker) {
    await worker.close();
    worker = null;
  }
  await jobDiffusionQueue.close();
  await connection.quit();
}
