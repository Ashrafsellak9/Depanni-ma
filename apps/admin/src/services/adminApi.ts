import { api, unwrap } from "@/lib/api";
import type { AdminOverview } from "@/types/admin";

export async function loginAdmin(email: string, password: string) {
  const res = await api.post("/auth/login", { email, password });
  return unwrap<{ user: { id: string; email: string; phone: string; role: string }; accessToken: string }>(res);
}

export async function fetchOverview(): Promise<AdminOverview> {
  const res = await api.get("/admin/overview");
  return unwrap<AdminOverview>(res);
}

export interface Paginated<T> {
  items: T[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export async function fetchMissions(params?: {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<Paginated<import("@/types/admin").AdminMissionRow>> {
  const res = await api.get("/admin/missions", { params });
  return unwrap(res);
}

export async function fetchMission(id: string) {
  const res = await api.get(`/admin/missions/${id}`);
  return unwrap<Record<string, unknown>>(res);
}

export async function fetchArtisans(params?: {
  kyc?: string;
  page?: number;
  limit?: number;
}): Promise<Paginated<Record<string, unknown>>> {
  const res = await api.get("/admin/artisans", { params });
  return unwrap(res);
}

export async function fetchArtisan(id: string) {
  const res = await api.get(`/admin/artisans/${id}`);
  return unwrap<Record<string, unknown>>(res);
}

export async function fetchKycPending(page = 1) {
  const res = await api.get("/admin/artisans/kyc-pending", { params: { page } });
  return unwrap<{ items: import("@/types/admin").KycPendingItem[]; total: number }>(res);
}

export async function fetchClients(page = 1) {
  const res = await api.get("/admin/clients", { params: { page } });
  return unwrap<Paginated<Record<string, unknown>>>(res);
}

export async function approveKyc(id: string) {
  const res = await api.post(`/admin/artisans/${id}/approve`);
  return unwrap(res);
}

export async function rejectKyc(id: string, reason: string) {
  const res = await api.post(`/admin/artisans/${id}/reject`, { reason });
  return unwrap(res);
}

