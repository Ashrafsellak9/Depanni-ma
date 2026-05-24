import { smsQueue } from "./queues.js";

export interface SmsJobData {
  to: string;
  body: string;
}

export async function enqueueSms(data: SmsJobData): Promise<void> {
  await smsQueue.add("send", data, {
    attempts: 3,
    backoff: { type: "exponential", delay: 3000 },
  });
}
