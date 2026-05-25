import { pdfQueue } from "./queues.js";

export interface PdfJobData {
  type: "monthly_report" | "transactions_export";
  payload: Record<string, unknown>;
  emailTo?: string;
}

export async function enqueuePdf(data: PdfJobData): Promise<void> {
  await pdfQueue.add("generate", data, {
    attempts: 2,
    backoff: { type: "fixed", delay: 10_000 },
  });
}
