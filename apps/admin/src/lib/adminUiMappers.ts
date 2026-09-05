import type { AdminMissionRow as UiMission } from "@/components/admin/missions/adminMissionsMock";
import type { AdminArtisan } from "@/components/admin/artisans/adminArtisansMock";
import type { AdminClient } from "@/components/admin/clients/adminClientsMock";
import type { KycDossier } from "@/components/admin/kyc/adminKycMock";
import type { AdminLitige, LitigeReason, LitigeStatus } from "@/components/admin/litiges/adminLitigesMock";
import type { Virement, VirementStatus } from "@/components/admin/virements/adminVirementsMock";
import type { AnalyticsKpiSnapshot } from "@/components/admin/analytics/adminAnalyticsMock";
import type { PeriodSnapshot } from "@/components/admin/revenus/adminRevenusMock";
import {
  avatarColor,
  formatRelativeFr,
  initials,
  mapArtisanAccountStatus,
  mapMissionStatus,
  periodFromDate,
  serviceEmoji,
} from "@/lib/adminMappers";
import type { AdminMissionRow } from "@/types/admin";
import type { AnalyticsDashboard, PayoutRow, RevenueReport } from "@/types/analytics";
import type { ArtisanListItem, DisputeListItem, KycPendingItem, KycStats } from "@/types/moderation";

export function mapApiMissionToUi(row: AdminMissionRow): UiMission {
  const name = `${row.citizen.firstName} ${row.citizen.lastName}`.trim();
  const artisan =
    row.artisan?.firstName != null
      ? `${row.artisan.firstName} ${(row.artisan.lastName ?? "")[0] ?? ""}.`.trim()
      : "—";
  const title = row.job.title || "Mission";
  return {
    id: row.id,
    client: {
      name,
      avatar: initials(row.citizen.firstName, row.citizen.lastName),
      color: avatarColor(name),
      location: row.job.city,
    },
    service: title,
    serviceSlug: title.toLowerCase().replace(/\s+/g, "-"),
    emoji: serviceEmoji(title),
    artisan,
    amount: Math.round(row.totalAmount),
    commission: Math.round(row.totalAmount * 0.15),
    status: mapMissionStatus(row.status),
    date: formatRelativeFr(row.createdAt),
    period: periodFromDate(row.createdAt),
    urgency: row.job.urgency === "URGENT" || row.job.urgency === "EMERGENCY",
  };
}

export function mapApiArtisanToUi(row: ArtisanListItem): AdminArtisan {
  const name = `${row.firstName} ${row.lastName}`.trim();
  const spec = row.specialties[0] ?? "Artisan";
  const status = mapArtisanAccountStatus(row.user.accountStatus, row.kycStatus);
  const commission =
    row.subscriptionTier === "PRO" ? "7%" : row.subscriptionTier === "PREMIUM" ? "10%" : "15%";
  const plan =
    row.subscriptionTier === "PRO"
      ? "Pro"
      : row.subscriptionTier === "PREMIUM"
        ? "Premium"
        : "Standard";
  return {
    id: row.id,
    initials: initials(row.firstName, row.lastName),
    color: avatarColor(name),
    name,
    spec,
    specEmoji: serviceEmoji(spec),
    zone: row.zones[0] ?? "El Jadida",
    missions: row.totalMissions,
    rating: row.rating || null,
    status: status === "pending" || status === "active" || status === "inactive" || status === "suspended"
      ? status
      : "inactive",
    commission,
    plan,
    verified: row.kycStatus.toUpperCase() === "APPROVED",
    joinDate: new Date(row.user.createdAt).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    phone: row.user.phone,
    revenue: `${Math.round(row.monthRevenue).toLocaleString("fr-FR")} MAD`,
  };
}

export function mapApiCitizenToUi(row: {
  id: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  user: { email: string; phone: string; isVerified: boolean; createdAt: string };
  _count: { jobs: number };
}): AdminClient {
  const name = `${row.firstName} ${row.lastName}`.trim();
  const created = new Date(row.user.createdAt);
  const days = (Date.now() - created.getTime()) / 86_400_000;
  const status =
    !row.user.isVerified && days < 14 ? "new" : row._count.jobs > 0 ? "active" : "inactive";
  return {
    id: row.id,
    initials: initials(row.firstName, row.lastName),
    color: avatarColor(name),
    name,
    email: row.user.email,
    phone: row.user.phone,
    city: "El Jadida",
    missions: row._count.jobs,
    totalSpent: 0,
    lastMission: row._count.jobs > 0 ? "—" : "Aucune",
    verified: row.user.isVerified,
    status,
    joinDate: created.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    rating: null,
  };
}

function kycDoc(docs: Record<string, string>, keys: string[]) {
  const hit = keys.find((k) => docs[k]);
  return hit
    ? { status: "uploaded" as const, name: docs[hit] ?? hit }
    : { status: "missing" as const, name: null };
}

export function mapApiKycToUi(item: KycPendingItem): KycDossier {
  const name = `${item.firstName} ${item.lastName}`.trim();
  const docs = item.kycDocuments ?? {};
  const cinFront = kycDoc(docs, ["cin_front", "cinFront", "CIN_FRONT", "cin"]);
  const cinBack = kycDoc(docs, ["cin_back", "cinBack", "CIN_BACK"]);
  const photo = kycDoc(docs, ["photo", "selfie", "portrait"]);
  const diploma = kycDoc(docs, ["diploma", "diplome", "certificate"]);
  const uploaded = [cinFront, cinBack, photo, diploma].filter((d) => d.status === "uploaded").length;
  const hours = Math.max(
    0,
    Math.round((Date.now() - new Date(item.createdAt).getTime()) / 3_600_000),
  );
  const spec = item.specialties[0] ?? "Artisan";
  return {
    id: item.id,
    artisanId: item.id,
    initials: initials(item.firstName, item.lastName),
    color: avatarColor(name),
    name,
    spec,
    specEmoji: serviceEmoji(spec),
    phone: item.user.phone,
    city: "El Jadida",
    submittedAt: formatRelativeFr(item.createdAt),
    waitingHours: hours,
    documents: {
      cin_front: cinFront,
      cin_back: cinBack,
      photo,
      diploma,
    },
    completeness: Math.round((uploaded / 4) * 100),
    priority: hours >= 48 ? "urgent" : "normal",
    notes: "",
  };
}

export function mapKycStatsToKpis(stats: KycStats) {
  return [
    {
      label: "En attente",
      value: stats.pending,
      suffix: "",
      change: "À traiter aujourd'hui",
      trend: "up" as const,
      icon: "Clock",
      iconBg: "orange" as const,
    },
    {
      label: "Délai moyen",
      value: `${Math.round(stats.avgProcessingHours)}h`,
      isString: true,
      suffix: "",
      change: "Objectif < 48h",
      trend: "up" as const,
      icon: "Timer",
      iconBg: "navy" as const,
    },
    {
      label: "Taux approbation",
      value: `${Math.round(stats.approvalRate)}%`,
      isString: true,
      suffix: "",
      change: "Ce mois",
      trend: "up" as const,
      icon: "CheckCircle",
      iconBg: "green" as const,
    },
    {
      label: "Approuvés / Refusés",
      value: `${stats.approved} / ${stats.rejected}`,
      isString: true,
      suffix: "",
      change: "Ce mois",
      trend: "up" as const,
      icon: "BarChart2",
      iconBg: "purple" as const,
    },
  ];
}

function mapDisputeReason(reason: string | null): { reason: LitigeReason; reasonLabel: string } {
  const r = (reason ?? "").toLowerCase();
  if (r.includes("price") || r.includes("prix")) {
    return { reason: "price_dispute", reasonLabel: "Désaccord sur le prix" };
  }
  if (r.includes("no_show") || r.includes("absent")) {
    return { reason: "no_show", reasonLabel: "Artisan absent" };
  }
  if (r.includes("damage") || r.includes("dégât")) {
    return { reason: "damage", reasonLabel: "Dégât constaté" };
  }
  if (r.includes("quality") || r.includes("qualité")) {
    return { reason: "quality", reasonLabel: "Qualité insuffisante" };
  }
  return { reason: "client_not_satisfied", reasonLabel: reason || "Client insatisfait" };
}

export function mapApiDisputeToUi(row: DisputeListItem): AdminLitige {
  const clientName = `${row.citizen.firstName} ${row.citizen.lastName}`.trim();
  const artisanName = `${row.artisan.firstName} ${row.artisan.lastName}`.trim();
  const s = row.status.toUpperCase();
  const status: LitigeStatus =
    s === "RESOLVED" || s === "CLOSED"
      ? "resolved"
      : s.includes("MEDIAT")
        ? "mediation"
        : s.includes("INFO")
          ? "pending_info"
          : "open";
  const { reason, reasonLabel } = mapDisputeReason(row.disputeReason);
  return {
    id: row.id,
    priority:
      status === "resolved"
        ? "resolved"
        : row.ageHours >= 72
          ? "urgent"
          : row.priorityScore >= 70
            ? "high"
            : "medium",
    mission: {
      id: row.missionId,
      service: row.job.title,
      emoji: serviceEmoji(row.job.title),
    },
    client: {
      name: clientName,
      avatar: initials(row.citizen.firstName, row.citizen.lastName),
      color: avatarColor(clientName),
    },
    artisan: {
      name: artisanName,
      avatar: initials(row.artisan.firstName, row.artisan.lastName),
      color: avatarColor(artisanName),
    },
    amount: Math.round(row.amount),
    reason,
    reasonLabel,
    description: row.disputeReason ?? "Litige ouvert — détails à analyser.",
    age: `${Math.round(row.ageHours)}h`,
    ageHours: row.ageHours,
    status,
    statusLabel:
      status === "resolved"
        ? "Résolu"
        : status === "mediation"
          ? "Médiation"
          : status === "pending_info"
            ? "Infos demandées"
            : "Ouvert",
    messages: 0,
    createdAt: row.disputeOpenedAt,
  };
}

export function mapApiPayoutToUi(row: PayoutRow): Virement {
  const name = `${row.artisan.firstName} ${row.artisan.lastName}`.trim();
  const s = row.status.toUpperCase();
  const status: VirementStatus =
    s === "COMPLETED" || s === "PAID" || s === "DONE"
      ? "done"
      : s === "FAILED" || s === "REJECTED"
        ? "failed"
        : s === "PROCESSING"
          ? "processing"
          : "pending";
  const hours = Math.max(
    0,
    Math.round((Date.now() - new Date(row.createdAt).getTime()) / 3_600_000),
  );
  return {
    id: row.id,
    artisan: {
      initials: initials(row.artisan.firstName, row.artisan.lastName),
      color: avatarColor(name),
      name,
      spec: "Artisan",
    },
    amount: Math.round(row.amount),
    missions: 0,
    iban: row.iban ?? "—",
    bank: row.bankName ?? "—",
    status,
    submittedAt: formatRelativeFr(row.createdAt),
    waitingHours: status === "pending" ? hours : 0,
    plan: "Standard",
    failReason: status === "failed" ? "Échec bancaire" : undefined,
  };
}

export function mapAnalyticsToKpi(dash: AnalyticsDashboard): AnalyticsKpiSnapshot {
  const m = dash.metrics;
  return {
    gmv: m.gmvTotal,
    gmvGrowth: m.gmvGrowth,
    revenue: m.depanniRevenue,
    missions: m.missionsCreated,
    completed: m.missionsCompleted,
    cancelled: m.missionsCancelled,
    completionRate: Math.round(m.completionRate * 10) / 10,
    demandes: m.jobsCreated,
    inscriptions: { citoyens: m.newSignups, artisans: 0 },
  };
}

export function mapRevenueToSnapshot(report: RevenueReport): PeriodSnapshot {
  return {
    gmv: report.summary.gmv,
    revenue: report.summary.depanniRevenue,
    commissionRate: Math.round(report.summary.avgCommissionRate * 1000) / 10,
    growth: report.summary.gmvGrowth,
    projection: {
      gmv: report.projection.projectedGmv,
      revenue: report.projection.projectedRevenue,
    },
    missions: report.summary.missionCount,
    weeks: report.periods.map((p) => ({
      label: p.label,
      gmv: p.gmv,
      revenue: p.revenue,
      missions: 0,
    })),
  };
}
