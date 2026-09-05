import { createServer } from "node:http";

import { disconnectDb } from "./config/db.js";
import { env } from "./config/env.js";
import { assertJwtKeyPairAtStartup } from "./config/jwt.js";
import { assertStorageConfiguredAtStartup } from "./config/s3.js";
import { disconnectRedis } from "./config/redis.js";
import { closeJobDiffusionQueue, startJobDiffusionWorker } from "./jobs/jobDiffusionQueue.js";
import { startMonthlyReportScheduler } from "./jobs/monthlyReport.cron.js";
import { closePayoutWorker, startPayoutWorker } from "./jobs/payout.worker.js";
import { closeEmailWorker, startEmailWorker } from "./jobs/email.worker.js";
import { closePdfWorker, startPdfWorker } from "./jobs/pdf.worker.js";
import { closeSmsWorker, startSmsWorker } from "./jobs/sms.worker.js";
import { closeQueues } from "./jobs/queues.js";
import { initSentry } from "./monitoring/sentry.js";
import { createApp } from "./app.js";
import { closeSocket, initSocket } from "./socket/index.js";
import { logger } from "./utils/logger.js";

const app = createApp();
const httpServer = createServer(app);

let isShuttingDown = false;

async function bootstrap(): Promise<void> {
  initSentry();
  assertJwtKeyPairAtStartup();
  assertStorageConfiguredAtStartup();
  startJobDiffusionWorker();
  startPayoutWorker();
  startEmailWorker();
  startSmsWorker();
  startPdfWorker();
  startMonthlyReportScheduler();
  await initSocket(httpServer);

  httpServer.listen(env.API_PORT, () => {
    logger.info(`DEPANNI API running on http://localhost:${env.API_PORT}`, {
      env: env.NODE_ENV,
    });
  });
}

async function shutdown(signal: string): Promise<void> {
  if (isShuttingDown) return;
  isShuttingDown = true;

  logger.info(`Received ${signal} — graceful shutdown`);

  await new Promise<void>((resolve, reject) => {
    httpServer.close((err) => (err ? reject(err) : resolve()));
  });

  await closeSocket();
  await closeJobDiffusionQueue();
  await closePayoutWorker();
  await closeEmailWorker();
  await closeSmsWorker();
  await closePdfWorker();
  await closeQueues();
  await disconnectRedis();
  await disconnectDb();

  logger.info("Shutdown complete");
  process.exit(0);
}

process.on("SIGTERM", () => void shutdown("SIGTERM"));
process.on("SIGINT", () => void shutdown("SIGINT"));

process.on("unhandledRejection", (reason: unknown) => {
  logger.error("Unhandled rejection", { reason: String(reason) });
});

process.on("uncaughtException", (err: Error) => {
  logger.error("Uncaught exception", { err: err.message, stack: err.stack });
  void shutdown("uncaughtException");
});

void bootstrap();
