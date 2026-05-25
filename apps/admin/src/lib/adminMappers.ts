import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

import type { OverviewMission } from "@/components/admin/MissionsTable";
import type { AdminStatus } from "@/components/admin/StatusPill";
import type {
  ActivityItem,
  AdminKpis,
  AdminMissionRow,
  AdminOverview,
  KycPendingItem as OverviewKycItem,
  RevenueChartPoint,
  TopArtisan,
} from "@/types/admin";
import type { KycPendingItem } from "@/types/moderation";

const AVATAR_COLORS = [
  "#1E3A5F",
  "#7C3AED",
  "#059669",
  "#DC2626",
  "#B45309",
  "#0891B2",
  "#F05A1A",
  "#1B8A4E",
];

export function formatMadSpaced(amount: number): string {
  if (!amount || amount <= 0) return "—";
  return `${Math.round(amount).toLocaleString("fr-FR")} MAD`;
}

export function initials(first: string, last: string): string {
  return `${(first[0] ?? "").toUpperCase()}${(last[0] ?? "").toUpperCase()}`;
}

export function avatarColor(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]!;
}

export function mapMissionStatus(status: string): AdminStatus {
  const s = status.toUpperCase();
  if (s === "COMPLETED") return "done";
  if (s === "CANCELLED") return "cancelled";
  if (["PENDING", "OFFERED", "WAITING"].some((x) => s.includes(x))) return "pending";
  if (["IN_PROGRESS", "ACCEPTED", "DISPUTED", "ACTIVE"].includes(s)) return "active";
  return "pending";
}

export function mapArtisanAccountStatus(status: string, kycStatus?: string): AdminStatus {
  const a = status.toUpperCase();
  if (a === "SUSPENDED" || a === "BANNED") return "suspended";
  if (a === "INACTIVE") return "inactive";
  if (kycStatus?.toUpperCase() === "PENDING" || kycStatus?.toUpperCase() === "SUBMITTED") {
    return "pending";
  }
  return "active";
}

export function mapOverviewMission(row: AdminMissionRow): OverviewMission {
  const client = `${row.citizen.firstName} ${row.citizen.lastName}`;
  const artisan =
    row.artisan?.firstName != null
      ? `${row.artisan.firstName} ${(row.artisan.lastName ?? "")[0] ?? ""}.`.trim()
      : "—";
  return {
    client,
    location: row.job.city,
    avatar: initials(row.citizen.firstName, row.citizen.lastName),
    avatarColor: avatarColor(client),
    service: row.job.title,
    serviceEmoji: "",
    artisan,
    amount: formatMadSpaced(row.totalAmount),
    status: mapMissionStatus(row.status),
    id: row.id,
  };
}

export function mapKpisToCards(kpis: AdminKpis) {
  return [
    {
      label: "Missions aujourd'hui",
      value: String(kpis.missionsToday),
      numericValue: kpis.missionsToday,
      change: "Temps réel",
      trend: "up" as const,
      icon: "ClipboardList",
      iconBg: "orange" as const,
    },
    {
      label: "GMV du jour (MAD)",
      value: kpis.gmvToday.toLocaleString("fr-FR"),
      numericValue: kpis.gmvToday,
      change: "Aujourd'hui",
      trend: "up" as const,
      icon: "Banknote",
      iconBg: "navy" as const,
    },
    {
      label: "Artisans actifs",
      value: String(kpis.activeArtisans),
      numericValue: kpis.activeArtisans,
      change: "En ligne",
      trend: "up" as const,
      icon: "HardHat",
      iconBg: "green" as const,
    },
    {
      label: "Satisfaction client",
      value: kpis.satisfaction.toFixed(1),
      numericValue: kpis.satisfaction,
      change: "Moyenne plateforme",
      trend: "up" as const,
      icon: "Star",
      iconBg: "purple" as const,
    },
  ];
}

const DAY_LABELS = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

export function mapRevenueChart(points: RevenueChartPoint[]) {
  const slice = points.slice(-7);
  const total = slice.reduce((s, p) => s + p.amount, 0);
  const prevTotal = slice.reduce((s, p) => s + (p.previousAmount ?? 0), 0);
  const pct =
    prevTotal > 0 ? Math.round(((total - prevTotal) / prevTotal) * 100) : 0;
  const trendLabel =
    pct >= 0 ? `+${pct}% vs période précédente` : `${pct}% vs période précédente`;

  const data = slice.map((p, i) => {
    const d = new Date(p.date);
    const day = DAY_LABELS[d.getDay()] ?? "—";
    const isLast = i === slice.length - 1;
    return { day, amount: p.amount, today: isLast };
  });

  return {
    total: formatMadSpaced(total),
    trend: trendLabel,
    trendUp: pct >= 0,
    data,
  };
}

export function mapActivityFeed(items: ActivityItem[]) {
  const dotMap: Record<string, string> = {
    mission: "bg-green",
    kyc: "bg-dep-purple",
    dispute: "bg-dep-red",
    payout: "bg-green",
  };
  return items.slice(0, 5).map((item) => ({
    dot: dotMap[item.type] ?? "bg-orange",
    text: item.message,
    time: formatDistanceToNow(new Date(item.at), { addSuffix: true, locale: fr }),
  }));
}

export function mapKycQueueItem(item: OverviewKycItem | KycPendingItem) {
  const name = `${item.firstName} ${item.lastName}`;
  const docs = Object.keys(item.kycDocuments ?? {});
  const complete = docs.length >= 2;
  const spec =
    "specialties" in item && item.specialties?.length
      ? (item.specialties[0] ?? "Artisan")
      : "Artisan";
  return {
    id: item.id,
    initials: initials(item.firstName, item.lastName),
    gradient: complete ? "from-green to-emerald-600" : "from-orange to-orange-2",
    name,
    spec,
    docs:
      docs.length === 0
        ? "Aucun document"
        : complete
          ? "Tous documents complets"
          : `${docs.length} document(s) uploadé(s)`,
    complete,
  };
}

export function mapTopArtisans(items: TopArtisan[]) {
  const gradients = [
    "from-orange to-orange-2",
    "from-dep-purple to-violet-600",
    "from-green to-emerald-600",
  ];
  return items.slice(0, 3).map((a, i) => ({
    rank: i + 1,
    id: a.id,
    initials: initials(a.firstName, a.lastName),
    gradient: gradients[i] ?? gradients[0]!,
    name: `${a.firstName} ${(a.lastName ?? "")[0] ?? ""}.`.trim(),
    spec: a.availabilityStatus === "AVAILABLE" ? "Disponible" : "Artisan",
    missions: a.totalMissions,
    rating: a.rating,
    revenue: Math.round(a.totalMissions * 260).toLocaleString("fr-FR"),
  }));
}

export function buildAlertMessage(kpis: AdminKpis): string | null {
  const parts: string[] = [];
  if (kpis.kycPending > 0) {
    parts.push(
      `${kpis.kycPending} artisan${kpis.kycPending > 1 ? "s" : ""} en attente de validation KYC`,
    );
  }
  if (kpis.disputesOpen > 0) {
    parts.push(
      `${kpis.disputesOpen} litige${kpis.disputesOpen > 1 ? "s" : ""} ouvert${kpis.disputesOpen > 1 ? "s" : ""} nécessitent votre attention`,
    );
  }
  if (parts.length === 0) return null;
  return parts.join(" · ");
}

export function mergeOverviewMissions(overview: AdminOverview): OverviewMission[] {
  const rows = [...overview.inProgressMissions, ...overview.recentMissions];
  const seen = new Set<string>();
  return rows
    .filter((r) => {
      if (seen.has(r.id)) return false;
      seen.add(r.id);
      return true;
    })
    .map(mapOverviewMission);
}
