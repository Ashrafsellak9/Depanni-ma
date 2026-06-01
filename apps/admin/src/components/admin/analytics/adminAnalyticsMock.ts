export type AnalyticsPeriodKey = "7j" | "30j" | "90j" | "12m";

export type AnalyticsKpiSnapshot = {
  gmv: number;
  gmvGrowth: number | null;
  revenue: number;
  missions: number;
  completed: number;
  cancelled: number;
  completionRate: number;
  demandes: number;
  inscriptions: { citoyens: number; artisans: number };
};

export const ANALYTICS_KPIS: Record<AnalyticsPeriodKey, AnalyticsKpiSnapshot> = {
  "7j": {
    gmv: 126400,
    gmvGrowth: 8.2,
    revenue: 15168,
    missions: 47,
    completed: 43,
    cancelled: 4,
    completionRate: 91.5,
    demandes: 58,
    inscriptions: { citoyens: 12, artisans: 3 },
  },
  "30j": {
    gmv: 480000,
    gmvGrowth: 18.4,
    revenue: 57600,
    missions: 187,
    completed: 168,
    cancelled: 19,
    completionRate: 89.8,
    demandes: 224,
    inscriptions: { citoyens: 48, artisans: 12 },
  },
  "90j": {
    gmv: 1240000,
    gmvGrowth: 42.1,
    revenue: 148800,
    missions: 486,
    completed: 432,
    cancelled: 54,
    completionRate: 88.9,
    demandes: 582,
    inscriptions: { citoyens: 124, artisans: 31 },
  },
  "12m": {
    gmv: 4200000,
    gmvGrowth: null,
    revenue: 504000,
    missions: 1680,
    completed: 1496,
    cancelled: 184,
    completionRate: 89.0,
    demandes: 2016,
    inscriptions: { citoyens: 420, artisans: 105 },
  },
};

export const PERIOD_TABS: { id: AnalyticsPeriodKey; label: string }[] = [
  { id: "7j", label: "7 jours" },
  { id: "30j", label: "30 jours" },
  { id: "90j", label: "90 jours" },
  { id: "12m", label: "12 mois" },
];

export const GMV_DAILY_DATA = [
  { date: "3 mai", gmv: 12400 },
  { date: "4 mai", gmv: 8200 },
  { date: "5 mai", gmv: 15600 },
  { date: "6 mai", gmv: 11800 },
  { date: "7 mai", gmv: 9400 },
  { date: "8 mai", gmv: 18200 },
  { date: "9 mai", gmv: 14600 },
  { date: "10 mai", gmv: 16800 },
  { date: "11 mai", gmv: 13200 },
  { date: "12 mai", gmv: 19400 },
  { date: "13 mai", gmv: 22800 },
  { date: "14 mai", gmv: 17200 },
  { date: "15 mai", gmv: 21400 },
  { date: "16 mai", gmv: 15600 },
  { date: "17 mai", gmv: 24200 },
  { date: "18 mai", gmv: 18800 },
  { date: "19 mai", gmv: 20400 },
  { date: "20 mai", gmv: 28600 },
  { date: "21 mai", gmv: 16200 },
  { date: "22 mai", gmv: 22400 },
  { date: "23 mai", gmv: 19800 },
  { date: "24 mai", gmv: 31200 },
  { date: "25 mai", gmv: 24600 },
  { date: "26 mai", gmv: 18400 },
  { date: "27 mai", gmv: 26800 },
  { date: "28 mai", gmv: 22000 },
  { date: "29 mai", gmv: 19200 },
  { date: "30 mai", gmv: 28400 },
  { date: "31 mai", gmv: 21600 },
  { date: "1 juin", gmv: 15800 },
];

export const CATEGORY_MISSIONS = [
  { name: "🔧 Plomberie", count: 68, revenue: 168000, color: "#F05A1A" },
  { name: "⚡ Électricité", count: 52, revenue: 124800, color: "#0F1E35" },
  { name: "🚗 Mécanique", count: 34, revenue: 86400, color: "#1B8A4E" },
  { name: "🔑 Serrurerie", count: 20, revenue: 48000, color: "#7C3AED" },
  { name: "🎨 Peinture", count: 9, revenue: 36000, color: "#0891B2" },
  { name: "🧹 Ménage", count: 18, revenue: 28800, color: "#B45309" },
  { name: "🛠️ Électroménager", count: 10, revenue: 24000, color: "#6B7280" },
];

export const INSCRIPTION_DATA = [
  { date: "3/5", citoyens: 2, artisans: 0 },
  { date: "5/5", citoyens: 3, artisans: 1 },
  { date: "7/5", citoyens: 1, artisans: 0 },
  { date: "9/5", citoyens: 4, artisans: 1 },
  { date: "11/5", citoyens: 2, artisans: 0 },
  { date: "13/5", citoyens: 5, artisans: 2 },
  { date: "15/5", citoyens: 3, artisans: 1 },
  { date: "17/5", citoyens: 6, artisans: 1 },
  { date: "19/5", citoyens: 2, artisans: 0 },
  { date: "21/5", citoyens: 4, artisans: 2 },
  { date: "23/5", citoyens: 7, artisans: 1 },
  { date: "25/5", citoyens: 3, artisans: 0 },
  { date: "27/5", citoyens: 8, artisans: 2 },
  { date: "29/5", citoyens: 4, artisans: 1 },
  { date: "31/5", citoyens: 6, artisans: 1 },
];

export const HEATMAP_DATA: Record<string, number[]> = {
  Dim: [0, 0, 0, 1, 2, 3, 4, 5, 6, 5, 4, 3, 4, 5, 4, 3, 2, 1, 0, 0, 0, 0, 0, 0],
  Lun: [0, 0, 0, 0, 1, 2, 4, 7, 9, 8, 7, 6, 5, 7, 8, 7, 6, 5, 3, 2, 1, 0, 0, 0],
  Mar: [0, 0, 0, 0, 1, 3, 5, 8, 10, 9, 8, 7, 6, 8, 9, 8, 7, 5, 3, 2, 1, 0, 0, 0],
  Mer: [0, 0, 0, 0, 1, 2, 4, 7, 9, 8, 7, 6, 5, 7, 8, 7, 5, 4, 3, 2, 1, 0, 0, 0],
  Jeu: [0, 0, 0, 0, 1, 3, 5, 8, 11, 9, 8, 7, 6, 8, 10, 8, 7, 5, 3, 2, 1, 0, 0, 0],
  Ven: [0, 0, 0, 0, 1, 3, 5, 8, 9, 8, 7, 6, 5, 7, 8, 7, 6, 4, 3, 2, 1, 0, 0, 0],
  Sam: [0, 0, 0, 1, 2, 3, 5, 7, 8, 7, 6, 5, 6, 7, 6, 5, 4, 3, 2, 1, 0, 0, 0, 0],
};

export const HEATMAP_LEGEND = [
  "#F4F0E8",
  "rgba(240,90,26,0.2)",
  "rgba(240,90,26,0.5)",
  "rgba(240,90,26,0.75)",
  "#F05A1A",
];

export type FunnelStep = {
  label: string;
  value: number;
  pct: number;
  color: string;
};

const FUNNEL_RATIOS = [
  { label: "Demandes créées", pct: 100, color: "#0F1E35", ratio: 1 },
  { label: "Offres reçues", pct: 88, color: "#1A2E4A", ratio: 0.88 },
  { label: "Offres acceptées", pct: 75, color: "#F05A1A", ratio: 0.75 },
  { label: "Missions complétées", pct: 67, color: "#1B8A4E", ratio: 0.674 },
];

export function getFunnelForPeriod(kpi: AnalyticsKpiSnapshot): FunnelStep[] {
  return FUNNEL_RATIOS.map((step) => ({
    label: step.label,
    value: Math.round(kpi.demandes * step.ratio),
    pct: step.pct,
    color: step.color,
  }));
}

export function getConversionRate(kpi: AnalyticsKpiSnapshot): number {
  const funnel = getFunnelForPeriod(kpi);
  const last = funnel[funnel.length - 1];
  const first = funnel[0];
  if (!last || !first || first.value === 0) return 0;
  return Math.round((last.value / first.value) * 1000) / 10;
}

export type Top10Entry = {
  initials: string;
  color: string;
  name: string;
  value: string | number;
};

export const TOP10_REVENUE: Top10Entry[] = [
  { initials: "KA", color: "#F05A1A", name: "Khalid Amrani", value: "8 320 MAD" },
  { initials: "OB", color: "#7C3AED", name: "Omar Benali", value: "6 440 MAD" },
  { initials: "SK", color: "#059669", name: "Saad Karimi", value: "5 760 MAD" },
  { initials: "YM", color: "#B45309", name: "Yassine Moukrim", value: "3 200 MAD" },
  { initials: "NB", color: "#1B8A4E", name: "Nadia Bensouda", value: "2 880 MAD" },
];

export const TOP10_MISSIONS: Top10Entry[] = [
  { initials: "KA", color: "#F05A1A", name: "Khalid Amrani", value: 32 },
  { initials: "OB", color: "#7C3AED", name: "Omar Benali", value: 28 },
  { initials: "SK", color: "#059669", name: "Saad Karimi", value: 24 },
  { initials: "NB", color: "#1B8A4E", name: "Nadia Bensouda", value: 18 },
  { initials: "YM", color: "#B45309", name: "Yassine Moukrim", value: 15 },
];

export const TOP10_RATING: Top10Entry[] = [
  { initials: "KA", color: "#F05A1A", name: "Khalid Amrani", value: 4.9 },
  { initials: "NB", color: "#1B8A4E", name: "Nadia Bensouda", value: 4.8 },
  { initials: "OB", color: "#7C3AED", name: "Omar Benali", value: 4.8 },
  { initials: "SK", color: "#059669", name: "Saad Karimi", value: 4.7 },
  { initials: "YM", color: "#B45309", name: "Yassine Moukrim", value: 4.6 },
];

export type KpiObjectif = {
  label: string;
  current: number;
  target: number;
  unit: string;
  pct: number;
  exceeded?: boolean;
};

export function getObjectifsForPeriod(kpi: AnalyticsKpiSnapshot): KpiObjectif[] {
  const inscriptionsTotal = kpi.inscriptions.citoyens + kpi.inscriptions.artisans;
  const completionExceeded = kpi.completionRate >= 85;

  return [
    {
      label: "GMV",
      current: kpi.gmv,
      target: 500000,
      unit: " MAD",
      pct: Math.round((kpi.gmv / 500000) * 100),
    },
    {
      label: "Revenus DEPANNI",
      current: kpi.revenue,
      target: 75000,
      unit: " MAD",
      pct: Math.round((kpi.revenue / 75000) * 100),
    },
    {
      label: "Missions complétées",
      current: kpi.completed,
      target: 800,
      unit: "",
      pct: Math.round((kpi.completed / 800) * 100),
    },
    {
      label: "Taux complétion %",
      current: kpi.completionRate,
      target: 85,
      unit: "%",
      pct: completionExceeded ? 100 : Math.round((kpi.completionRate / 85) * 100),
      exceeded: completionExceeded,
    },
    {
      label: "Inscriptions",
      current: inscriptionsTotal,
      target: 200,
      unit: "",
      pct: Math.round((inscriptionsTotal / 200) * 100),
    },
  ];
}

export const GEO_DISTRIBUTION = [
  { zone: "El Jadida Centre", count: 82, pct: 43 },
  { zone: "Hay Hassani", count: 48, pct: 26 },
  { zone: "Cité Essalam", count: 26, pct: 14 },
  { zone: "Sidi Bouzid", count: 18, pct: 10 },
  { zone: "Autres", count: 13, pct: 7 },
];

export function heatmapCellColor(v: number): string {
  if (v === 0) return "#F4F0E8";
  if (v <= 3) return "rgba(240,90,26,0.2)";
  if (v <= 6) return "rgba(240,90,26,0.5)";
  if (v <= 9) return "rgba(240,90,26,0.75)";
  return "#F05A1A";
}
