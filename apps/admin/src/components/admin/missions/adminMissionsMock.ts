import type { AdminStatus } from "@/components/admin/StatusPill";

export type AdminMissionRow = {
  id: string;
  client: { name: string; avatar: string; color: string; location: string };
  service: string;
  serviceSlug: string;
  emoji: string;
  artisan: string;
  amount: number;
  commission: number;
  status: AdminStatus;
  date: string;
  period: "today" | "yesterday" | "week" | "older";
  urgency: boolean;
};

export const MISSION_KPIS = [
  {
    label: "Total aujourd'hui",
    value: 47,
    suffix: "",
    change: "+12% vs hier",
    trend: "up" as const,
    icon: "ClipboardList",
    iconBg: "orange" as const,
  },
  {
    label: "En cours",
    value: 8,
    suffix: "",
    change: "Temps réel",
    trend: "up" as const,
    icon: "Zap",
    iconBg: "green" as const,
  },
  {
    label: "En attente",
    value: 5,
    suffix: "",
    change: "Sans artisan",
    trend: "up" as const,
    icon: "Clock",
    iconBg: "orange" as const,
  },
  {
    label: "GMV du jour",
    value: 18200,
    suffix: " MAD",
    change: "+8% vs hier",
    trend: "up" as const,
    icon: "Banknote",
    iconBg: "navy" as const,
  },
];

export const MOCK_MISSIONS: AdminMissionRow[] = [
  {
    id: "M-1089",
    client: { name: "Fatima Zahra", avatar: "FZ", color: "#1E3A5F", location: "Hay Hassani" },
    service: "Plomberie",
    serviceSlug: "plomberie",
    emoji: "🔧",
    artisan: "Khalid A.",
    amount: 255,
    commission: 38,
    status: "done",
    date: "Aujourd'hui 14h30",
    period: "today",
    urgency: true,
  },
  {
    id: "M-1088",
    client: { name: "Mohammed Ouali", avatar: "MO", color: "#7C3AED", location: "Centre-ville" },
    service: "Électricité",
    serviceSlug: "electricite",
    emoji: "⚡",
    artisan: "Omar B.",
    amount: 180,
    commission: 27,
    status: "active",
    date: "Aujourd'hui 13h15",
    period: "today",
    urgency: false,
  },
  {
    id: "M-1087",
    client: { name: "Youssef Belhaj", avatar: "YB", color: "#059669", location: "Bd Hassan II" },
    service: "Serrurerie",
    serviceSlug: "serrurerie",
    emoji: "🔑",
    artisan: "—",
    amount: 0,
    commission: 0,
    status: "pending",
    date: "Aujourd'hui 12h50",
    period: "today",
    urgency: true,
  },
  {
    id: "M-1086",
    client: { name: "Hassan Alami", avatar: "HA", color: "#DC2626", location: "Hay Mohammadi" },
    service: "Mécanique",
    serviceSlug: "mecanique",
    emoji: "🚗",
    artisan: "Saad K.",
    amount: 320,
    commission: 48,
    status: "active",
    date: "Aujourd'hui 11h00",
    period: "today",
    urgency: false,
  },
  {
    id: "M-1085",
    client: { name: "Nadia Azzouzi", avatar: "NA", color: "#B45309", location: "Cité Essalam" },
    service: "Peinture",
    serviceSlug: "peinture",
    emoji: "🎨",
    artisan: "Amine T.",
    amount: 800,
    commission: 120,
    status: "done",
    date: "Aujourd'hui 09h30",
    period: "today",
    urgency: false,
  },
  {
    id: "M-1084",
    client: { name: "Karim Fassi", avatar: "KF", color: "#0891B2", location: "Hay Hassani" },
    service: "Ménage",
    serviceSlug: "menage",
    emoji: "🧹",
    artisan: "Sara M.",
    amount: 150,
    commission: 22,
    status: "done",
    date: "Hier 17h00",
    period: "yesterday",
    urgency: false,
  },
  {
    id: "M-1083",
    client: { name: "Samira Idrissi", avatar: "SI", color: "#7C3AED", location: "Centre" },
    service: "Électroménager",
    serviceSlug: "electromenager",
    emoji: "🛠️",
    artisan: "Rachid F.",
    amount: 280,
    commission: 42,
    status: "done",
    date: "Hier 15h30",
    period: "yesterday",
    urgency: false,
  },
  {
    id: "M-1082",
    client: { name: "Omar Kettani", avatar: "OK", color: "#059669", location: "Sidi Bouzid" },
    service: "Plomberie",
    serviceSlug: "plomberie",
    emoji: "🔧",
    artisan: "Khalid A.",
    amount: 190,
    commission: 28,
    status: "done",
    date: "Hier 11h00",
    period: "yesterday",
    urgency: true,
  },
  {
    id: "M-1081",
    client: { name: "Layla Bennis", avatar: "LB", color: "#F05A1A", location: "Hay Mohammed" },
    service: "Électricité",
    serviceSlug: "electricite",
    emoji: "⚡",
    artisan: "Omar B.",
    amount: 240,
    commission: 36,
    status: "cancelled",
    date: "Hier 09h00",
    period: "yesterday",
    urgency: false,
  },
  {
    id: "M-1080",
    client: { name: "Ahmed Tazi", avatar: "AT", color: "#1E3A5F", location: "Centre-ville" },
    service: "Serrurerie",
    serviceSlug: "serrurerie",
    emoji: "🔑",
    artisan: "Yassine M.",
    amount: 120,
    commission: 18,
    status: "done",
    date: "Il y a 2j",
    period: "week",
    urgency: true,
  },
  {
    id: "M-1079",
    client: { name: "Rachida Benjelloun", avatar: "RB", color: "#6366F1", location: "Azemmour" },
    service: "Plomberie",
    serviceSlug: "plomberie",
    emoji: "🔧",
    artisan: "Khalid A.",
    amount: 210,
    commission: 31,
    status: "active",
    date: "Il y a 2j",
    period: "week",
    urgency: false,
  },
  {
    id: "M-1078",
    client: { name: "Driss Alaoui", avatar: "DA", color: "#0D9488", location: "Hay Hassani" },
    service: "Électricité",
    serviceSlug: "electricite",
    emoji: "⚡",
    artisan: "—",
    amount: 0,
    commission: 0,
    status: "pending",
    date: "Il y a 3j",
    period: "week",
    urgency: true,
  },
  {
    id: "M-1077",
    client: { name: "Zineb Chraibi", avatar: "ZC", color: "#DB2777", location: "Centre" },
    service: "Peinture",
    serviceSlug: "peinture",
    emoji: "🎨",
    artisan: "Amine T.",
    amount: 450,
    commission: 67,
    status: "done",
    date: "Il y a 3j",
    period: "week",
    urgency: false,
  },
  {
    id: "M-1076",
    client: { name: "Mustapha Berrada", avatar: "MB", color: "#4F46E5", location: "Sidi Bouzid" },
    service: "Mécanique",
    serviceSlug: "mecanique",
    emoji: "🚗",
    artisan: "Saad K.",
    amount: 290,
    commission: 43,
    status: "cancelled",
    date: "Il y a 4j",
    period: "older",
    urgency: false,
  },
  {
    id: "M-1075",
    client: { name: "Houda El Fassi", avatar: "HE", color: "#EA580C", location: "Hay Mohammed" },
    service: "Ménage",
    serviceSlug: "menage",
    emoji: "🧹",
    artisan: "Sara M.",
    amount: 120,
    commission: 18,
    status: "done",
    date: "Il y a 5j",
    period: "older",
    urgency: false,
  },
];

export type MissionSortKey =
  | "id"
  | "client"
  | "service"
  | "artisan"
  | "amount"
  | "commission"
  | "status"
  | "date";

export function filterAndSortMissions(
  missions: AdminMissionRow[],
  opts: {
    search: string;
    statusFilter: string;
    serviceFilter: string;
    period: string;
    urgentOnly: boolean;
    sortKey: MissionSortKey;
    sortDir: "asc" | "desc";
  },
): AdminMissionRow[] {
  let result = [...missions];

  if (opts.search.trim()) {
    const q = opts.search.toLowerCase();
    result = result.filter(
      (m) =>
        m.id.toLowerCase().includes(q) ||
        m.client.name.toLowerCase().includes(q) ||
        m.artisan.toLowerCase().includes(q) ||
        m.service.toLowerCase().includes(q) ||
        m.client.location.toLowerCase().includes(q),
    );
  }

  if (opts.statusFilter !== "all") {
    result = result.filter((m) => m.status === opts.statusFilter);
  }

  if (opts.serviceFilter !== "all") {
    result = result.filter((m) => m.serviceSlug === opts.serviceFilter);
  }

  if (opts.period === "today") {
    result = result.filter((m) => m.period === "today");
  } else if (opts.period === "week") {
    result = result.filter((m) => m.period === "today" || m.period === "yesterday" || m.period === "week");
  } else if (opts.period === "month") {
    result = result.filter((m) => m.period !== "older" || m.date.includes("5j"));
  }

  if (opts.urgentOnly) {
    result = result.filter((m) => m.urgency);
  }

  const dir = opts.sortDir === "asc" ? 1 : -1;

  result.sort((a, b) => {
    switch (opts.sortKey) {
      case "amount":
        return (a.amount - b.amount) * dir;
      case "commission":
        return (a.commission - b.commission) * dir;
      case "id":
        return a.id.localeCompare(b.id) * dir;
      case "client":
        return a.client.name.localeCompare(b.client.name) * dir;
      case "service":
        return a.service.localeCompare(b.service) * dir;
      case "artisan":
        return a.artisan.localeCompare(b.artisan) * dir;
      case "status":
        return a.status.localeCompare(b.status) * dir;
      case "date":
      default:
        return b.id.localeCompare(a.id) * dir;
    }
  });

  return result;
}
