export const BALANCE = {
  available: 2840,
  goalCurrent: 3200,
  goalTarget: 5000,
  nextTransfer: "demain 09h00",
};

export const BAR_CHART_DATA = [
  { day: "Lun", brut: 255, net: 216 },
  { day: "Mar", brut: 425, net: 361 },
  { day: "Mer", brut: 0, net: 0 },
  { day: "Jeu", brut: 680, net: 578 },
  { day: "Ven", brut: 320, net: 272 },
  { day: "Sam", brut: 850, net: 722 },
  { day: "Dim", brut: 670, net: 569 },
];

export const SERVICE_BREAKDOWN = [
  { name: "Plomberie", value: 2800, color: "#F05A1A", pct: "74%" },
  { name: "Électricité", value: 600, color: "#0F1E35", pct: "16%" },
  { name: "Serrurerie", value: 365, color: "#1B8A4E", pct: "10%" },
];

export const KPIS = [
  {
    label: "Brut ce mois",
    value: "3 765",
    suffix: " MAD",
    icon: "TrendingUp" as const,
    iconBg: "rgba(27,138,78,0.1)",
    iconColor: "#1B8A4E",
    change: "+18% vs avril",
    changeUp: true as const,
  },
  {
    label: "Net ce mois",
    value: "3 200",
    suffix: " MAD",
    icon: "Wallet" as const,
    iconBg: "rgba(15,30,53,0.07)",
    iconColor: "#0F1E35",
    change: "Après commissions",
    changeUp: null,
  },
  {
    label: "Commissions",
    value: "565",
    suffix: " MAD",
    icon: "Percent" as const,
    iconBg: "rgba(240,90,26,0.1)",
    iconColor: "#F05A1A",
    change: "15% standard",
    changeUp: null,
  },
  {
    label: "Missions",
    value: "12",
    suffix: "",
    icon: "ClipboardCheck" as const,
    iconBg: "rgba(124,58,237,0.1)",
    iconColor: "#7C3AED",
    change: "+3 vs mois dernier",
    changeUp: true as const,
  },
];

export type TransactionType = "mission" | "virement" | "abonnement";
export type TransactionStatus = "completed" | "pending";

export interface RevenusTransaction {
  id: string;
  type: TransactionType;
  title: string;
  subtitle: string;
  date: string;
  amount: number;
  status?: TransactionStatus;
}

export const TRANSACTIONS: RevenusTransaction[] = [
  {
    id: "tx-1",
    type: "mission",
    title: "Mission — Fuite eau",
    subtitle: "Mohammed O. · Net après commission",
    date: "Aujourd'hui 16:30",
    amount: 255,
    status: "completed",
  },
  {
    id: "tx-2",
    type: "mission",
    title: "Mission — Tableau électrique",
    subtitle: "Hassan A. · Net après commission",
    date: "Hier 11h15",
    amount: 340,
    status: "completed",
  },
  {
    id: "tx-3",
    type: "abonnement",
    title: "Abonnement Premium",
    subtitle: "Commission réduite 10%",
    date: "01 Mai 2026",
    amount: -150,
    status: "completed",
  },
  {
    id: "tx-4",
    type: "virement",
    title: "Virement CIH Bank ****4521",
    subtitle: "Délai 24 h ouvrées",
    date: "28 Avr 2026",
    amount: 2100,
    status: "pending",
  },
  {
    id: "tx-5",
    type: "mission",
    title: "Mission — Chauffe-eau",
    subtitle: "Youssef B. · Net après commission",
    date: "27 Avr 2026",
    amount: 425,
    status: "completed",
  },
];
