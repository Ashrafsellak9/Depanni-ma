import { emailQueue } from "./queues.js";

export interface EmailJobData {
  to: string;
  subject: string;
  html: string;
}

export async function enqueueEmail(data: EmailJobData): Promise<void> {
  await emailQueue.add("send", data, {
    attempts: 3,
    backoff: { type: "exponential", delay: 5000 },
  });
}
