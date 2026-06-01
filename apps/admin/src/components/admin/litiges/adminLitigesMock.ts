export type LitigePriority = "urgent" | "high" | "medium" | "low" | "resolved";
export type LitigeStatus = "open" | "mediation" | "pending_info" | "resolved";
export type LitigeReason =
  | "client_not_satisfied"
  | "price_dispute"
  | "no_show"
  | "damage"
  | "quality";

export type AdminLitige = {
  id: string;
  priority: LitigePriority;
  mission: { id: string; service: string; emoji: string };
  client: { name: string; avatar: string; color: string };
  artisan: { name: string; avatar: string; color: string };
  amount: number;
  reason: LitigeReason;
  reasonLabel: string;
  description: string;
  age: string;
  ageHours: number;
  status: LitigeStatus;
  statusLabel: string;
  messages: number;
  createdAt: string;
};

export const LITIGE_KPIS = [
  {
    label: "Litiges ouverts",
    value: 8,
    suffix: "",
    change: "+2 cette semaine",
    trend: "up" as const,
    icon: "AlertTriangle",
    iconBg: "red" as const,
  },
  {
    label: "En médiation",
    value: 3,
    suffix: "",
    change: "Sous 72h",
    trend: "up" as const,
    icon: "MessageSquare",
    iconBg: "orange" as const,
  },
  {
    label: "Résolus ce mois",
    value: 24,
    suffix: "",
    change: "Taux 89%",
    trend: "up" as const,
    icon: "CheckCircle",
    iconBg: "green" as const,
  },
  {
    label: "Montant contesté",
    value: 3240,
    suffix: " MAD",
    change: "À arbitrer",
    trend: "up" as const,
    icon: "Banknote",
    iconBg: "navy" as const,
  },
];

export const MOCK_LITIGES: AdminLitige[] = [
  {
    id: "LIT-007",
    priority: "urgent",
    mission: { id: "M-1082", service: "Plomberie", emoji: "🔧" },
    client: { name: "Omar Kettani", avatar: "OK", color: "#059669" },
    artisan: { name: "Khalid Amrani", avatar: "KA", color: "#F05A1A" },
    amount: 190,
    reason: "client_not_satisfied",
    reasonLabel: "Client insatisfait du travail",
    description:
      "Le client affirme que la fuite n'a pas été correctement réparée et est réapparue 2h après l'intervention.",
    age: "78h",
    ageHours: 78,
    status: "open",
    statusLabel: "Ouvert",
    messages: 4,
    createdAt: "25 Mai 2026 · 14h30",
  },
  {
    id: "LIT-006",
    priority: "urgent",
    mission: { id: "M-1079", service: "Électricité", emoji: "⚡" },
    client: { name: "Samira Idrissi", avatar: "SI", color: "#7C3AED" },
    artisan: { name: "Omar Benali", avatar: "OB", color: "#7C3AED" },
    amount: 580,
    reason: "price_dispute",
    reasonLabel: "Désaccord sur le prix final",
    description:
      "L'artisan a facturé 580 MAD alors que le devis accepté était de 350 MAD. Le client refuse de payer la différence.",
    age: "52h",
    ageHours: 52,
    status: "mediation",
    statusLabel: "En médiation",
    messages: 7,
    createdAt: "26 Mai 2026 · 09h15",
  },
  {
    id: "LIT-005",
    priority: "high",
    mission: { id: "M-1076", service: "Serrurerie", emoji: "🔑" },
    client: { name: "Fatima Zahra", avatar: "FZ", color: "#1E3A5F" },
    artisan: { name: "Yassine Moukrim", avatar: "YM", color: "#B45309" },
    amount: 200,
    reason: "no_show",
    reasonLabel: "Artisan ne s'est pas présenté",
    description:
      "L'artisan a accepté la mission mais ne s'est jamais présenté. Le client a dû faire appel à un autre prestataire.",
    age: "28h",
    ageHours: 28,
    status: "open",
    statusLabel: "Ouvert",
    messages: 2,
    createdAt: "27 Mai 2026 · 10h00",
  },
  {
    id: "LIT-004",
    priority: "medium",
    mission: { id: "M-1071", service: "Peinture", emoji: "🎨" },
    client: { name: "Hassan Alami", avatar: "HA", color: "#DC2626" },
    artisan: { name: "Amine Tahiri", avatar: "AT", color: "#0891B2" },
    amount: 800,
    reason: "quality",
    reasonLabel: "Qualité insuffisante",
    description:
      "Le client juge la qualité de la peinture inacceptable : coulures, zones non peintes, mauvaise finition.",
    age: "14h",
    ageHours: 14,
    status: "mediation",
    statusLabel: "En médiation",
    messages: 5,
    createdAt: "27 Mai 2026 · 16h00",
  },
  {
    id: "LIT-003",
    priority: "medium",
    mission: { id: "M-1068", service: "Mécanique", emoji: "🚗" },
    client: { name: "Youssef Belhaj", avatar: "YB", color: "#059669" },
    artisan: { name: "Saad Karimi", avatar: "SK", color: "#059669" },
    amount: 320,
    reason: "damage",
    reasonLabel: "Dommages causés par l'artisan",
    description:
      "L'artisan aurait endommagé un composant supplémentaire lors de la réparation. Le client demande réparation.",
    age: "6h",
    ageHours: 6,
    status: "open",
    statusLabel: "Ouvert",
    messages: 1,
    createdAt: "28 Mai 2026 · 08h30",
  },
  {
    id: "LIT-002",
    priority: "low",
    mission: { id: "M-1061", service: "Ménage", emoji: "🧹" },
    client: { name: "Nadia Azzouzi", avatar: "NA", color: "#B45309" },
    artisan: { name: "Sara Moussaoui", avatar: "SM", color: "#7C3AED" },
    amount: 150,
    reason: "client_not_satisfied",
    reasonLabel: "Client insatisfait",
    description: "Le client estime que le ménage a été bâclé.",
    age: "3h",
    ageHours: 3,
    status: "pending_info",
    statusLabel: "En attente d'info",
    messages: 0,
    createdAt: "28 Mai 2026 · 11h15",
  },
  {
    id: "LIT-001a",
    priority: "resolved",
    mission: { id: "M-1058", service: "Plomberie", emoji: "🔧" },
    client: { name: "Karim Fassi", avatar: "KF", color: "#0891B2" },
    artisan: { name: "Khalid Amrani", avatar: "KA", color: "#F05A1A" },
    amount: 250,
    reason: "price_dispute",
    reasonLabel: "Désaccord sur le prix",
    description: "Résolu : remboursement partiel de 80 MAD accordé au client.",
    age: "Résolu",
    ageHours: 0,
    status: "resolved",
    statusLabel: "Résolu",
    messages: 9,
    createdAt: "24 Mai 2026 · 09h00",
  },
  {
    id: "LIT-001b",
    priority: "resolved",
    mission: { id: "M-1055", service: "Électroménager", emoji: "🛠️" },
    client: { name: "Layla Bennis", avatar: "LB", color: "#F05A1A" },
    artisan: { name: "Rachid Filali", avatar: "RF", color: "#DC2626" },
    amount: 180,
    reason: "no_show",
    reasonLabel: "Artisan absent",
    description: "Résolu : remboursement intégral + artisan averti.",
    age: "Résolu",
    ageHours: 0,
    status: "resolved",
    statusLabel: "Résolu",
    messages: 6,
    createdAt: "23 Mai 2026 · 14h00",
  },
];

export const STATUS_TABS = [
  { id: "all", label: "Tous", count: 8 },
  { id: "open", label: "Ouverts", count: 3 },
  { id: "mediation", label: "Médiation", count: 2 },
  { id: "pending_info", label: "En attente", count: 1 },
  { id: "resolved", label: "Résolus", count: 2 },
] as const;

export type LitigeStatusFilter = (typeof STATUS_TABS)[number]["id"];

const REASON_FILTER_MAP: Record<string, LitigeReason> = {
  client_not_satisfied: "client_not_satisfied",
  price_dispute: "price_dispute",
  no_show: "no_show",
  damage: "damage",
  quality: "quality",
};

export function filterLitiges(
  litiges: AdminLitige[],
  opts: {
    statusFilter: LitigeStatusFilter;
    priorityFilter: string;
    reasonFilter: string;
  },
): AdminLitige[] {
  let result = [...litiges];

  if (opts.statusFilter !== "all") {
    result = result.filter((l) => l.status === opts.statusFilter);
  }

  if (opts.priorityFilter !== "all") {
    result = result.filter((l) => l.priority === opts.priorityFilter);
  }

  if (opts.reasonFilter !== "all") {
    const reason = REASON_FILTER_MAP[opts.reasonFilter];
    if (reason) result = result.filter((l) => l.reason === reason);
  }

  return result.sort((a, b) => {
    if (a.status === "resolved" && b.status !== "resolved") return 1;
    if (b.status === "resolved" && a.status !== "resolved") return -1;
    return b.ageHours - a.ageHours;
  });
}

export function getUrgentOverdueCount(litiges: AdminLitige[]) {
  return litiges.filter((l) => l.status !== "resolved" && l.ageHours >= 72).length;
}

export function getHighAmountCount(litiges: AdminLitige[], threshold = 500) {
  return litiges.filter((l) => l.status !== "resolved" && l.amount > threshold).length;
}
