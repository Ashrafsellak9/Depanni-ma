import type { JobCreateWizardInput } from "@depanni/validators";

import { api, unwrapApi } from "@/src/lib/api";
import type { CitizenJob, CitizenOffer } from "@/src/types/job";

export interface WizardPhoto {
  uri: string;
  mimeType?: string;
  fileName?: string;
}

export async function createJob(
  data: JobCreateWizardInput,
  photos: WizardPhoto[],
): Promise<{ id: string }> {
  const form = new FormData();
  form.append("categoryId", data.categoryId);
  form.append("subcategory", data.subcategory);
  form.append("title", data.title);
  form.append("description", data.description);
  form.append("urgency", data.urgency);
  form.append("lat", String(data.lat));
  form.append("lng", String(data.lng));
  form.append("address", data.address);
  form.append("city", data.city);
  if (data.budgetMin != null) form.append("budgetMin", String(data.budgetMin));
  if (data.budgetMax != null) form.append("budgetMax", String(data.budgetMax));
  if (data.scheduledAt) form.append("scheduledAt", data.scheduledAt);

  photos.forEach((p, i) => {
    form.append("photos", {
      uri: p.uri,
      type: p.mimeType ?? "image/jpeg",
      name: p.fileName ?? `photo-${i}.jpg`,
    } as unknown as Blob);
  });

  const res = await api.post("/jobs", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return unwrapApi<{ id: string }>(res);
}

export async function fetchJob(jobId: string): Promise<CitizenJob> {
  const res = await api.get(`/jobs/${jobId}`);
  return unwrapApi<CitizenJob>(res);
}

export async function acceptOffer(jobId: string, offerId: string): Promise<unknown> {
  const res = await api.post(`/jobs/${jobId}/offers/${offerId}/accept`);
  return unwrapApi(res);
}

export async function rejectOffer(jobId: string, offerId: string): Promise<unknown> {
  const res = await api.post(`/jobs/${jobId}/offers/${offerId}/reject`);
  return unwrapApi(res);
}

export async function completeMission(jobId: string, offerId: string): Promise<unknown> {
  const res = await api.post(`/jobs/${jobId}/offers/${offerId}/complete`);
  return unwrapApi(res);
}

export async function submitReview(payload: {
  missionId: string;
  rating: number;
  comment?: string;
  criteria: {
    punctuality: number;
    quality: number;
    cleanliness: number;
    communication: number;
    price: number;
  };
}): Promise<unknown> {
  const res = await api.post("/reviews", payload);
  return unwrapApi(res);
}

export async function listOffers(jobId: string): Promise<CitizenOffer[]> {
  const res = await api.get(`/jobs/${jobId}/offers`);
  return unwrapApi<CitizenOffer[]>(res);
}
