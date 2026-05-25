import { api, unwrap } from "@/lib/api";
import type { AdminOverview } from "@/types/admin";
import type {
  AnalyticsDashboard,
  AnalyticsPeriod,
  PayoutRow,
  RevenueReport,
} from "@/types/analytics";
import type { ArtisanListItem, DisputeListItem, KycPendingItem, KycStats } from "@/types/moderation";

export interface PeriodParams {
  period?: AnalyticsPeriod;
  from?: string;
  to?: string;
}

export async function loginAdmin(email: string, password: string) {
  const res = await api.post("/auth/login", { email, password });
  return unwrap<{ user: { id: string; email: string; phone: string; role: string }; accessToken: string }>(res);
}

export async function fetchOverview(): Promise<AdminOverview> {
  const res = await api.get("/admin/overview");
  return unwrap<AdminOverview>(res);
}

export interface PageInfo {
  nextCursor: string | null;
  hasMore: boolean;
  limit: number;
}

export interface CursorPaginated<T> {
  items: T[];
  pageInfo: PageInfo;
  total?: number;
}

/** @deprecated offset pagination — prefer CursorPaginated */
export interface Paginated<T> {
  items: T[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export interface ArtisansListParams {
  search?: string;
  kyc?: string;
  specialty?: string;
  city?: string;
  ratingMin?: number;
  subscription?: string;
  accountStatus?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  cursor?: string;
  limit?: number;
}

export async function fetchArtisans(params?: ArtisansListParams): Promise<CursorPaginated<ArtisanListItem>> {
  const res = await api.get("/admin/artisans", { params });
  return unwrap(res);
}

export async function fetchArtisan(id: string) {
  const res = await api.get(`/admin/artisans/${id}`);
  return unwrap<Record<string, unknown>>(res);
}

export async function fetchKycPending(page = 1) {
  const res = await api.get("/admin/artisans/kyc-pending", { params: { page, limit: 50 } });
  return unwrap<{
    items: KycPendingItem[];
    total: number;
    stats: KycStats;
  }>(res);
}

export async function fetchKycStats() {
  const res = await api.get("/admin/artisans/kyc-stats");
  return unwrap<KycStats>(res);
}

export async function approveKyc(id: string) {
  const res = await api.post(`/admin/artisans/${id}/approve`);
  return unwrap(res);
}

export async function rejectKyc(
  id: string,
  body: { reason: string; predefinedReason?: string; sendEmail?: boolean },
) {
  const res = await api.post(`/admin/artisans/${id}/reject`, body);
  return unwrap(res);
}

export async function suspendArtisan(id: string, note?: string) {
  const res = await api.post(`/admin/artisans/${id}/suspend`, { note });
  return unwrap(res);
}

export async function banArtisan(id: string, note?: string) {
  const res = await api.post(`/admin/artisans/${id}/ban`, { note });
  return unwrap(res);
}

export async function reactivateArtisan(id: string) {
  const res = await api.post(`/admin/artisans/${id}/reactivate`);
  return unwrap(res);
}

export async function upgradeArtisanSubscription(id: string, tier: string) {
  const res = await api.post(`/admin/artisans/${id}/subscription`, { tier });
  return unwrap(res);
}

export async function resetArtisanRating(id: string) {
  const res = await api.post(`/admin/artisans/${id}/reset-rating`);
  return unwrap(res);
}

export async function sendArtisanMessage(id: string, content: string) {
  const res = await api.post(`/admin/artisans/${id}/message`, { content });
  return unwrap(res);
}

export async function fetchDisputes() {
  const res = await api.get("/admin/disputes");
  return unwrap<DisputeListItem[]>(res);
}

export async function fetchDispute(id: string) {
  const res = await api.get(`/admin/disputes/${id}`);
  return unwrap<Record<string, unknown>>(res);
}

export async function resolveDispute(
  id: string,
  body: {
    resolution: "REFUND_CLIENT" | "RELEASE_ARTISAN" | "SPLIT";
    clientAmount?: number;
    artisanAmount?: number;
    note?: string;
  },
) {
  const res = await api.post(`/admin/disputes/${id}/resolve`, body);
  return unwrap(res);
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

export async function fetchClients(page = 1) {
  const res = await api.get("/admin/clients", { params: { page } });
  return unwrap<Paginated<Record<string, unknown>>>(res);
}

export async function fetchAnalytics(params: PeriodParams): Promise<AnalyticsDashboard> {
  const res = await api.get("/admin/analytics", { params });
  return unwrap(res);
}

export async function fetchRevenueReport(params: PeriodParams): Promise<RevenueReport> {
  const res = await api.get("/admin/finances/revenue", { params });
  return unwrap(res);
}

export async function fetchTransactionsExport(params: PeriodParams) {
  const res = await api.get("/admin/finances/transactions", { params });
  return unwrap<{
    missions: Record<string, unknown>[];
    walletTransactions: Record<string, unknown>[];
    payouts: Record<string, unknown>[];
  }>(res);
}

export async function fetchPayouts(status?: string) {
  const res = await api.get("/admin/payouts", { params: { limit: 100, status } });
  return unwrap<Paginated<PayoutRow>>(res);
}

export async function processPendingPayoutsBatch() {
  const res = await api.post("/admin/payouts/batch-pending");
  return unwrap<{ processed: number; total: number }>(res);
}

export async function batchPayoutArtisans(artisanIds: string[]) {
  const res = await api.post("/admin/payouts/batch", { artisanIds });
  return unwrap(res);
}
