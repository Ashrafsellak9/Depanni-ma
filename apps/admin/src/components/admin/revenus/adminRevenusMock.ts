export type RevenusPeriodKey = "7j" | "30j" | "90j" | "12m";

export type WeekRow = {
  label: string;
  gmv: number;
  revenue: number;
  missions: number;
};

export type PeriodSnapshot = {
  gmv: number;
  revenue: number;
  commissionRate: number;
  growth: number | null;
  projection: { gmv: number; revenue: number };
  missions: number;
  weeks: WeekRow[];
};

export const PERIOD_DATA: Record<RevenusPeriodKey, PeriodSnapshot> = {
  "7j": {
    gmv: 126400,
    revenue: 15168,
    commissionRate: 12.0,
    growth: 8.2,
    projection: { gmv: 180000, revenue: 21600 },
    missions: 47,
    weeks: [
      { label: "Mar 27", gmv: 18200, revenue: 2184, missions: 8 },
      { label: "Mer 28", gmv: 22400, revenue: 2688, missions: 9 },
      { label: "Jeu 29", gmv: 15600, revenue: 1872, missions: 6 },
      { label: "Ven 30", gmv: 28800, revenue: 3456, missions: 12 },
      { label: "Sam 31", gmv: 19200, revenue: 2304, missions: 7 },
      { label: "Dim 1", gmv: 14400, revenue: 1728, missions: 5 },
      { label: "Lun 2", gmv: 7800, revenue: 936, missions: 3 },
    ],
  },
  "30j": {
    gmv: 480000,
    revenue: 57600,
    commissionRate: 12.0,
    growth: 18.4,
    projection: { gmv: 520000, revenue: 62400 },
    missions: 187,
    weeks: [
      { label: "02–08 Mai", gmv: 98400, revenue: 11808, missions: 38 },
      { label: "09–15 Mai", gmv: 112600, revenue: 13512, missions: 44 },
      { label: "16–22 Mai", gmv: 124800, revenue: 14976, missions: 49 },
      { label: "23–29 Mai", gmv: 118200, revenue: 14184, missions: 46 },
      { label: "30 Mai–1 Juin", gmv: 26000, revenue: 3120, missions: 10 },
    ],
  },
  "90j": {
    gmv: 1240000,
    revenue: 148800,
    commissionRate: 12.0,
    growth: 42.1,
    projection: { gmv: 1680000, revenue: 201600 },
    missions: 486,
    weeks: [],
  },
  "12m": {
    gmv: 4200000,
    revenue: 504000,
    commissionRate: 12.0,
    growth: null,
    projection: { gmv: 6000000, revenue: 720000 },
    missions: 1680,
    weeks: [],
  },
};

export const CATEGORY_DATA = [
  {
    emoji: "🔧",
    name: "Plomberie",
    gmv: 168000,
    revenue: 20160,
    missions: 68,
    avgTicket: 2470,
    growth: 22,
  },
  {
    emoji: "⚡",
    name: "Électricité",
    gmv: 124800,
    revenue: 14976,
    missions: 52,
    avgTicket: 2400,
    growth: 15,
  },
  {
    emoji: "🚗",
    name: "Mécanique",
    gmv: 86400,
    revenue: 10368,
    missions: 34,
    avgTicket: 2541,
    growth: 8,
  },
  {
    emoji: "🔑",
    name: "Serrurerie",
    gmv: 48000,
    revenue: 5760,
    missions: 20,
    avgTicket: 2400,
    growth: 31,
  },
  {
    emoji: "🎨",
    name: "Peinture",
    gmv: 36000,
    revenue: 4320,
    missions: 9,
    avgTicket: 4000,
    growth: -4,
  },
  {
    emoji: "🧹",
    name: "Ménage",
    gmv: 28800,
    revenue: 3456,
    missions: 18,
    avgTicket: 1600,
    growth: 12,
  },
  {
    emoji: "🛠️",
    name: "Électroménager",
    gmv: 24000,
    revenue: 2880,
    missions: 10,
    avgTicket: 2400,
    growth: 5,
  },
];

export const TOP_ARTISANS = [
  {
    initials: "KA",
    color: "#F05A1A",
    name: "Khalid Amrani",
    spec: "Plomberie",
    gmv: 24800,
    revenue: 2976,
    missions: 32,
    commission: "10%",
  },
  {
    initials: "OB",
    color: "#7C3AED",
    name: "Omar Benali",
    spec: "Électricité",
    gmv: 19200,
    revenue: 2304,
    missions: 28,
    commission: "15%",
  },
  {
    initials: "SK",
    color: "#059669",
    name: "Saad Karimi",
    spec: "Mécanique",
    gmv: 16400,
    revenue: 1968,
    missions: 24,
    commission: "15%",
  },
  {
    initials: "YM",
    color: "#B45309",
    name: "Yassine Moukrim",
    spec: "Plomberie",
    gmv: 12800,
    revenue: 1536,
    missions: 15,
    commission: "15%",
  },
  {
    initials: "NB",
    color: "#1B8A4E",
    name: "Nadia Bensouda",
    spec: "Ménage",
    gmv: 9600,
    revenue: 1152,
    missions: 18,
    commission: "10%",
  },
];

export const COMMISSION_TIERS = [
  { label: "Standard (15%)", artisans: 38, revenue: 38400, pct: 67 },
  { label: "Premium (10%)", artisans: 12, revenue: 14400, pct: 25 },
  { label: "Pro (7%)", artisans: 3, revenue: 4800, pct: 8 },
];

export const PERIOD_TABS: { id: RevenusPeriodKey; label: string }[] = [
  { id: "7j", label: "7 jours" },
  { id: "30j", label: "30 jours" },
  { id: "90j", label: "90 jours" },
  { id: "12m", label: "12 mois" },
];

export const PIE_COLORS = [
  "#F05A1A",
  "#0F1E35",
  "#1B8A4E",
  "#7C3AED",
  "#0891B2",
  "#B45309",
  "#6B7280",
];

export const CATEGORY_GMV_TOTAL = CATEGORY_DATA.reduce((s, c) => s + c.gmv, 0);
