export type ArtisanStatus = "active" | "pending" | "inactive" | "suspended";

export type AdminArtisan = {
  id: string;
  initials: string;
  color: string;
  name: string;
  spec: string;
  specEmoji: string;
  zone: string;
  missions: number;
  rating: number | null;
  status: ArtisanStatus;
  commission: string;
  plan: string;
  verified: boolean;
  joinDate: string;
  phone: string;
  revenue: string;
};

export const ARTISAN_KPIS = [
  {
    label: "Total inscrits",
    value: 280,
    suffix: "",
    change: "+12 ce mois",
    trend: "up" as const,
    icon: "HardHat",
    iconBg: "navy" as const,
  },
  {
    label: "Actifs aujourd'hui",
    value: 38,
    suffix: "",
    change: "En ligne maintenant",
    trend: "up" as const,
    icon: "Zap",
    iconBg: "green" as const,
  },
  {
    label: "En attente KYC",
    value: 7,
    suffix: "",
    change: "À valider",
    trend: "up" as const,
    icon: "ClipboardList",
    iconBg: "orange" as const,
  },
  {
    label: "Note moyenne",
    value: 4.8,
    suffix: "/5",
    change: "↑ +0.1 ce mois",
    trend: "up" as const,
    icon: "Star",
    iconBg: "purple" as const,
  },
];

export const MOCK_ARTISANS: AdminArtisan[] = [
  {
    id: "A-001",
    initials: "KA",
    color: "#F05A1A",
    name: "Khalid Amrani",
    spec: "Plomberie",
    specEmoji: "🔧",
    zone: "El Jadida Centre",
    missions: 32,
    rating: 4.9,
    status: "active",
    commission: "10%",
    plan: "Premium",
    verified: true,
    joinDate: "15 Jan 2026",
    phone: "0600000001",
    revenue: "8 320 MAD",
  },
  {
    id: "A-002",
    initials: "OB",
    color: "#7C3AED",
    name: "Omar Benali",
    spec: "Électricité",
    specEmoji: "⚡",
    zone: "Hay Hassani",
    missions: 28,
    rating: 4.8,
    status: "active",
    commission: "15%",
    plan: "Standard",
    verified: true,
    joinDate: "20 Jan 2026",
    phone: "0600000002",
    revenue: "6 440 MAD",
  },
  {
    id: "A-003",
    initials: "SK",
    color: "#059669",
    name: "Saad Karimi",
    spec: "Mécanique",
    specEmoji: "🚗",
    zone: "Zone Industrielle",
    missions: 24,
    rating: 4.7,
    status: "active",
    commission: "15%",
    plan: "Standard",
    verified: true,
    joinDate: "01 Fév 2026",
    phone: "0600000003",
    revenue: "5 760 MAD",
  },
  {
    id: "A-004",
    initials: "RF",
    color: "#DC2626",
    name: "Rachid Filali",
    spec: "Électricité",
    specEmoji: "⚡",
    zone: "El Jadida",
    missions: 0,
    rating: null,
    status: "pending",
    commission: "—",
    plan: "—",
    verified: false,
    joinDate: "25 Mai 2026",
    phone: "0611111111",
    revenue: "0 MAD",
  },
  {
    id: "A-005",
    initials: "YM",
    color: "#B45309",
    name: "Yassine Moukrim",
    spec: "Plomberie",
    specEmoji: "🔧",
    zone: "Hay Mohammed",
    missions: 15,
    rating: 4.6,
    status: "active",
    commission: "15%",
    plan: "Standard",
    verified: true,
    joinDate: "10 Fév 2026",
    phone: "0600000005",
    revenue: "3 200 MAD",
  },
  {
    id: "A-006",
    initials: "AT",
    color: "#0891B2",
    name: "Amine Tahiri",
    spec: "Peinture",
    specEmoji: "🎨",
    zone: "Cité Essalam",
    missions: 8,
    rating: 4.3,
    status: "active",
    commission: "15%",
    plan: "Standard",
    verified: true,
    joinDate: "15 Fév 2026",
    phone: "0600000006",
    revenue: "1 840 MAD",
  },
  {
    id: "A-007",
    initials: "SM",
    color: "#7C3AED",
    name: "Samir Moussaoui",
    spec: "Serrurerie",
    specEmoji: "🔑",
    zone: "Centre",
    missions: 0,
    rating: null,
    status: "pending",
    commission: "—",
    plan: "—",
    verified: false,
    joinDate: "27 Mai 2026",
    phone: "0622222222",
    revenue: "0 MAD",
  },
  {
    id: "A-008",
    initials: "HB",
    color: "#1B8A4E",
    name: "Hassan Bakkali",
    spec: "Menuiserie",
    specEmoji: "🪵",
    zone: "Bd Hassan II",
    missions: 5,
    rating: 4.1,
    status: "inactive",
    commission: "15%",
    plan: "Standard",
    verified: true,
    joinDate: "01 Mar 2026",
    phone: "0600000008",
    revenue: "980 MAD",
  },
  {
    id: "A-009",
    initials: "LA",
    color: "#F05A1A",
    name: "Leila Amrani",
    spec: "Peinture",
    specEmoji: "🎨",
    zone: "Casablanca",
    missions: 0,
    rating: 4.5,
    status: "active",
    commission: "15%",
    plan: "Standard",
    verified: true,
    joinDate: "20 Mar 2026",
    phone: "0600000009",
    revenue: "0 MAD",
  },
  {
    id: "A-010",
    initials: "FE",
    color: "#DC2626",
    name: "Fouad El Idrissi",
    spec: "Plomberie",
    specEmoji: "🔧",
    zone: "El Jadida Sud",
    missions: 2,
    rating: 3.2,
    status: "suspended",
    commission: "15%",
    plan: "Standard",
    verified: true,
    joinDate: "10 Avr 2026",
    phone: "0600000010",
    revenue: "420 MAD",
  },
  {
    id: "A-011",
    initials: "NB",
    color: "#059669",
    name: "Nadia Bensouda",
    spec: "Ménage",
    specEmoji: "🧹",
    zone: "Hay Hassani",
    missions: 18,
    rating: 4.8,
    status: "active",
    commission: "10%",
    plan: "Premium",
    verified: true,
    joinDate: "05 Mar 2026",
    phone: "0600000011",
    revenue: "2 160 MAD",
  },
  {
    id: "A-012",
    initials: "AB",
    color: "#0891B2",
    name: "Ahmed Benmoussa",
    spec: "Plomberie",
    specEmoji: "🔧",
    zone: "El Jadida",
    missions: 0,
    rating: null,
    status: "pending",
    commission: "—",
    plan: "—",
    verified: false,
    joinDate: "28 Mai 2026",
    phone: "0633333333",
    revenue: "0 MAD",
  },
];

export const STATUS_TABS = [
  { id: "all", label: "Tous", count: 12 },
  { id: "active", label: "Actifs", count: 7 },
  { id: "pending", label: "KYC en attente", count: 3 },
  { id: "inactive", label: "Inactifs", count: 1 },
  { id: "suspended", label: "Suspendus", count: 1 },
] as const;

export type ArtisanStatusFilter = (typeof STATUS_TABS)[number]["id"];

export function filterArtisans(
  artisans: AdminArtisan[],
  opts: { statusFilter: ArtisanStatusFilter; search: string; specialty: string },
): AdminArtisan[] {
  let result = [...artisans];

  if (opts.statusFilter !== "all") {
    result = result.filter((a) => a.status === opts.statusFilter);
  }

  if (opts.specialty) {
    result = result.filter((a) => a.spec === opts.specialty);
  }

  if (opts.search.trim()) {
    const q = opts.search.toLowerCase();
    result = result.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.spec.toLowerCase().includes(q) ||
        a.zone.toLowerCase().includes(q) ||
        a.id.toLowerCase().includes(q),
    );
  }

  return result;
}

export const SPECIALTY_OPTIONS = [
  "Plomberie",
  "Électricité",
  "Mécanique",
  "Serrurerie",
  "Peinture",
  "Ménage",
  "Menuiserie",
];
