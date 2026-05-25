import { api, unwrapApi } from "@/src/lib/api";
import type {
  ArtisanEarnings,
  ArtisanProfile,
  ArtisanMission,
  MissionsListResponse,
  ActiveJobFeed,
} from "@/src/types/artisan";

export async function fetchArtisanProfile(): Promise<ArtisanProfile> {
  const res = await api.get("/artisans/me");
  return unwrapApi<ArtisanProfile>(res);
}

export async function setAvailability(isAvailable: boolean): Promise<{ availabilityStatus: string }> {
  const res = await api.post("/artisans/me/availability", { isAvailable });
  return unwrapApi(res);
}

export async function postLocation(coords: { lat: number; lng: number }): Promise<unknown> {
  const res = await api.post("/artisans/me/location", coords);
  return unwrapApi(res);
}

export async function fetchEarnings(): Promise<ArtisanEarnings> {
  const res = await api.get("/artisans/me/earnings");
  return unwrapApi<ArtisanEarnings>(res);
}

export async function fetchMissions(params?: {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<MissionsListResponse> {
  const res = await api.get("/artisans/me/missions", { params });
  return unwrapApi<MissionsListResponse>(res);
}

export async function fetchMission(missionId: string): Promise<ArtisanMission> {
  const res = await api.get(`/artisans/me/missions/${missionId}`);
  return unwrapApi<ArtisanMission>(res);
}

export async function updateProfile(body: {
  bio?: string;
  specialties?: string[];
  zones?: string[];
  hourlyRate?: number;
  serviceRadiusKm?: number;
}): Promise<ArtisanProfile> {
  const res = await api.patch("/artisans/me", body);
  return unwrapApi<ArtisanProfile>(res);
}

export async function requestPayout(body: {
  amount: number;
  bankName: string;
  iban: string;
}): Promise<unknown> {
  const res = await api.post("/artisans/me/payout-request", body);
  return unwrapApi(res);
}

export async function fetchActiveJobs(lat: number, lng: number): Promise<ActiveJobFeed[]> {
  const res = await api.get("/jobs/active", { params: { lat, lng, limit: 20 } });
  return unwrapApi<ActiveJobFeed[]>(res);
}

/** @deprecated Utiliser submitJobOffer depuis services/jobs.ts */
export async function submitOffer(
  jobId: string,
  body: { price: number; eta_minutes: number; message?: string },
): Promise<unknown> {
  const res = await api.post(`/jobs/${jobId}/offers`, body);
  return unwrapApi(res);
}
