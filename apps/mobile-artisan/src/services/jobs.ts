import { api, unwrapApi } from "@/src/lib/api";
import type { IncomingJobPayload } from "@/src/types/job-alert";

export interface JobDetail extends IncomingJobPayload {
  status: string;
  acceptsOffers?: boolean;
  mission?: { id: string } | null;
}

export async function fetchJob(jobId: string): Promise<JobDetail> {
  const res = await api.get(`/jobs/${jobId}`);
  return unwrapApi<JobDetail>(res);
}

export async function submitJobOffer(
  jobId: string,
  body: { price: number; eta_minutes: number; message?: string },
): Promise<unknown> {
  const res = await api.post(`/jobs/${jobId}/offers`, body);
  return unwrapApi(res);
}

export async function completeMissionOffer(
  jobId: string,
  offerId: string,
): Promise<{ mission: { id: string; artisanNet?: number }; job: { status: string } }> {
  const res = await api.patch(`/jobs/${jobId}/offers/${offerId}/complete`);
  return unwrapApi(res);
}
