export type ClientStatus = "active" | "new" | "inactive" | "blocked";

export type AdminClient = {
  id: string;
  initials: string;
  color: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  missions: number;
  totalSpent: number;
  lastMission: string;
  verified: boolean;
  status: ClientStatus;
  joinDate: string;
  rating: number | null;
};

export const CLIENT_KPIS = [
  {
    label: "Total clients",
    value: 1240,
    suffix: "",
    change: "+48 ce mois",
    trend: "up" as const,
    icon: "Users",
    iconBg: "navy" as const,
  },
  {
    label: "Actifs ce mois",
    value: 380,
    suffix: "",
    change: "30% du total",
    trend: "up" as const,
    icon: "TrendingUp",
    iconBg: "green" as const,
  },
  {
    label: "Nouveaux (7j)",
    value: 23,
    suffix: "",
    change: "+15% vs sem. dernière",
    trend: "up" as const,
    icon: "UserPlus",
    iconBg: "orange" as const,
  },
  {
    label: "Satisfaction moy.",
    value: 4.8,
    suffix: "/5",
    change: "200 avis clients",
    trend: "up" as const,
    icon: "Star",
    iconBg: "purple" as const,
  },
];

export const MOCK_CLIENTS: AdminClient[] = [
  {
    id: "C-001",
    initials: "FZ",
    color: "#1E3A5F",
    name: "Fatima Zahra El Mansouri",
    email: "fatima.z@gmail.com",
    phone: "+212 6 12 34 56 78",
    city: "El Jadida",
    missions: 8,
    totalSpent: 1840,
    lastMission: "Aujourd'hui",
    verified: true,
    status: "active",
    joinDate: "15 Jan 2026",
    rating: 5,
  },
  {
    id: "C-002",
    initials: "MO",
    color: "#7C3AED",
    name: "Mohammed Ouali",
    email: "m.ouali@gmail.com",
    phone: "+212 6 23 45 67 89",
    city: "El Jadida",
    missions: 5,
    totalSpent: 920,
    lastMission: "Hier",
    verified: true,
    status: "active",
    joinDate: "20 Jan 2026",
    rating: 4,
  },
  {
    id: "C-003",
    initials: "YB",
    color: "#059669",
    name: "Youssef Belhaj",
    email: "y.belhaj@gmail.com",
    phone: "+212 6 34 56 78 90",
    city: "El Jadida Centre",
    missions: 3,
    totalSpent: 560,
    lastMission: "Il y a 2j",
    verified: true,
    status: "active",
    joinDate: "01 Fév 2026",
    rating: 5,
  },
  {
    id: "C-004",
    initials: "HA",
    color: "#DC2626",
    name: "Hassan Alami",
    email: "h.alami@yahoo.fr",
    phone: "+212 6 45 67 89 01",
    city: "Hay Hassani",
    missions: 2,
    totalSpent: 500,
    lastMission: "Il y a 5j",
    verified: true,
    status: "active",
    joinDate: "10 Fév 2026",
    rating: 4,
  },
  {
    id: "C-005",
    initials: "NA",
    color: "#B45309",
    name: "Nadia Azzouzi",
    email: "nadia.a@gmail.com",
    phone: "+212 6 56 78 90 12",
    city: "Cité Essalam",
    missions: 6,
    totalSpent: 2100,
    lastMission: "Il y a 3j",
    verified: true,
    status: "active",
    joinDate: "15 Fév 2026",
    rating: 5,
  },
  {
    id: "C-006",
    initials: "KF",
    color: "#0891B2",
    name: "Karim Fassi",
    email: "k.fassi@gmail.com",
    phone: "+212 6 67 89 01 23",
    city: "El Jadida",
    missions: 1,
    totalSpent: 255,
    lastMission: "Il y a 1 sem.",
    verified: true,
    status: "active",
    joinDate: "01 Mar 2026",
    rating: 5,
  },
  {
    id: "C-007",
    initials: "SI",
    color: "#7C3AED",
    name: "Samira Idrissi",
    email: "samira.i@gmail.com",
    phone: "+212 6 78 90 12 34",
    city: "Casablanca",
    missions: 0,
    totalSpent: 0,
    lastMission: "—",
    verified: false,
    status: "new",
    joinDate: "25 Mai 2026",
    rating: null,
  },
  {
    id: "C-008",
    initials: "OK",
    color: "#059669",
    name: "Omar Kettani",
    email: "o.kettani@gmail.com",
    phone: "+212 6 89 01 23 45",
    city: "Sidi Bouzid",
    missions: 4,
    totalSpent: 780,
    lastMission: "Il y a 4j",
    verified: true,
    status: "active",
    joinDate: "20 Mar 2026",
    rating: 4,
  },
  {
    id: "C-009",
    initials: "LB",
    color: "#F05A1A",
    name: "Layla Bennis",
    email: "l.bennis@gmail.com",
    phone: "+212 6 90 12 34 56",
    city: "El Jadida",
    missions: 1,
    totalSpent: 180,
    lastMission: "Il y a 2 sem.",
    verified: true,
    status: "inactive",
    joinDate: "01 Avr 2026",
    rating: 3,
  },
  {
    id: "C-010",
    initials: "AT",
    color: "#1E3A5F",
    name: "Ahmed Tazi",
    email: "ahmed.tazi@gmail.com",
    phone: "+212 6 01 23 45 67",
    city: "Centre-ville",
    missions: 3,
    totalSpent: 640,
    lastMission: "Il y a 1 sem.",
    verified: true,
    status: "active",
    joinDate: "10 Avr 2026",
    rating: 5,
  },
  {
    id: "C-011",
    initials: "HM",
    color: "#DC2626",
    name: "Houda Mansouri",
    email: "h.mansouri@gmail.com",
    phone: "+212 6 12 23 34 45",
    city: "El Jadida",
    missions: 0,
    totalSpent: 0,
    lastMission: "—",
    verified: false,
    status: "new",
    joinDate: "28 Mai 2026",
    rating: null,
  },
  {
    id: "C-012",
    initials: "ZB",
    color: "#B45309",
    name: "Zakaria Bennani",
    email: "z.bennani@gmail.com",
    phone: "+212 6 23 34 45 56",
    city: "Hay Mohammed",
    missions: 1,
    totalSpent: 320,
    lastMission: "Il y a 3j",
    verified: true,
    status: "active",
    joinDate: "15 Mai 2026",
    rating: null,
  },
];

export const STATUS_TABS = [
  { id: "all", label: "Tous", count: 12 },
  { id: "active", label: "Actifs", count: 9 },
  { id: "new", label: "Nouveaux", count: 2 },
  { id: "inactive", label: "Inactifs", count: 1 },
] as const;

export type ClientStatusFilter = (typeof STATUS_TABS)[number]["id"];

export const CITY_OPTIONS = ["El Jadida", "Casablanca", "Hay Hassani"];

export const TOTAL_CLIENTS_DB = 1240;

export const RECENT_MISSIONS = [
  {
    emoji: "🔧",
    service: "Fuite robinet",
    artisan: "Khalid A.",
    price: 255,
    date: "Aujourd'hui",
    rating: 5,
  },
  {
    emoji: "⚡",
    service: "Tableau électrique",
    artisan: "Omar B.",
    price: 180,
    date: "Il y a 3j",
    rating: 4,
  },
];

export function filterClients(
  clients: AdminClient[],
  opts: { statusFilter: ClientStatusFilter; search: string; city: string },
): AdminClient[] {
  let result = [...clients];

  if (opts.statusFilter !== "all") {
    result = result.filter((c) => c.status === opts.statusFilter);
  }

  if (opts.city) {
    result = result.filter((c) => c.city.includes(opts.city));
  }

  if (opts.search.trim()) {
    const q = opts.search.toLowerCase();
    result = result.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.id.toLowerCase().includes(q),
    );
  }

  return result;
}
