export type VirementStatus = "pending" | "processing" | "done" | "failed";

export type VirementArtisan = {
  initials: string;
  color: string;
  name: string;
  spec: string;
};

export type Virement = {
  id: string;
  artisan: VirementArtisan;
  amount: number;
  missions: number;
  iban: string;
  bank: string;
  status: VirementStatus;
  submittedAt: string;
  waitingHours: number;
  plan: "Premium" | "Standard";
  failReason?: string;
  processedAt?: string;
};

export type VirementFilterId = "all" | VirementStatus;

export const VIREMENT_KPIS = [
  {
    label: "En attente",
    value: 12,
    icon: "Clock",
    iconBg: "orange" as const,
    change: "À traiter aujourd'hui",
    trend: "up" as const,
  },
  {
    label: "Total à virer",
    value: "24 840",
    suffix: " MAD",
    icon: "Banknote",
    iconBg: "red" as const,
    change: "12 artisans",
    trend: "up" as const,
    isString: true,
  },
  {
    label: "Virés ce mois",
    value: "186 400",
    suffix: " MAD",
    icon: "CheckCircle",
    iconBg: "green" as const,
    change: "48 virements",
    trend: "up" as const,
    isString: true,
  },
  {
    label: "Délai moyen",
    value: "18h",
    icon: "Timer",
    iconBg: "navy" as const,
    change: "Objectif < 24h",
    trend: "up" as const,
    isString: true,
  },
];

export const MOCK_VIREMENTS: Virement[] = [
  {
    id: "VIR-012",
    artisan: { initials: "KA", color: "#F05A1A", name: "Khalid Amrani", spec: "Plombier" },
    amount: 2840,
    missions: 12,
    iban: "CIH ****4521",
    bank: "CIH Bank",
    status: "pending",
    submittedAt: "Aujourd'hui 09h00",
    waitingHours: 3,
    plan: "Premium",
  },
  {
    id: "VIR-011",
    artisan: { initials: "OB", color: "#7C3AED", name: "Omar Benali", spec: "Électricien" },
    amount: 1920,
    missions: 8,
    iban: "ATW ****7832",
    bank: "Attijariwafa",
    status: "pending",
    submittedAt: "Aujourd'hui 08h30",
    waitingHours: 4,
    plan: "Standard",
  },
  {
    id: "VIR-010",
    artisan: { initials: "SK", color: "#059669", name: "Saad Karimi", spec: "Mécanicien" },
    amount: 3200,
    missions: 14,
    iban: "BP ****2291",
    bank: "Banque Populaire",
    status: "pending",
    submittedAt: "Hier 18h00",
    waitingHours: 27,
    plan: "Standard",
  },
  {
    id: "VIR-009",
    artisan: { initials: "YM", color: "#B45309", name: "Yassine Moukrim", spec: "Plombier" },
    amount: 1360,
    missions: 6,
    iban: "CIH ****9104",
    bank: "CIH Bank",
    status: "pending",
    submittedAt: "Hier 16h45",
    waitingHours: 28,
    plan: "Standard",
  },
  {
    id: "VIR-008",
    artisan: { initials: "AT", color: "#0891B2", name: "Amine Tahiri", spec: "Peintre" },
    amount: 680,
    missions: 3,
    iban: "BMCE ****5543",
    bank: "BMCE Bank",
    status: "pending",
    submittedAt: "Hier 14h00",
    waitingHours: 31,
    plan: "Standard",
  },
  {
    id: "VIR-007",
    artisan: { initials: "NB", color: "#1B8A4E", name: "Nadia Bensouda", spec: "Ménage" },
    amount: 1530,
    missions: 9,
    iban: "ATW ****3317",
    bank: "Attijariwafa",
    status: "failed",
    submittedAt: "Hier 11h00",
    waitingHours: 34,
    plan: "Premium",
    failReason: "IBAN invalide — à corriger",
  },
  {
    id: "VIR-006",
    artisan: { initials: "HB", color: "#1E3A5F", name: "Hassan Bakkali", spec: "Menuisier" },
    amount: 510,
    missions: 3,
    iban: "Orange ****8821",
    bank: "Orange Money",
    status: "pending",
    submittedAt: "Il y a 2j",
    waitingHours: 48,
    plan: "Standard",
  },
  {
    id: "VIR-005",
    artisan: { initials: "FO", color: "#F05A1A", name: "Fatima Ouhsaine", spec: "Ménage" },
    amount: 2100,
    missions: 11,
    iban: "CIH ****1108",
    bank: "CIH Bank",
    status: "processing",
    submittedAt: "Il y a 2j",
    waitingHours: 36,
    plan: "Premium",
  },
  {
    id: "VIR-004",
    artisan: { initials: "RF", color: "#DC2626", name: "Rachid Filali", spec: "Électricien" },
    amount: 4200,
    missions: 18,
    iban: "BP ****6644",
    bank: "Banque Populaire",
    status: "done",
    submittedAt: "Il y a 3j",
    waitingHours: 0,
    plan: "Standard",
    processedAt: "Hier 10h00",
  },
  {
    id: "VIR-003",
    artisan: { initials: "KO", color: "#1E3A5F", name: "Khalid Ouazzani", spec: "Maçon" },
    amount: 1800,
    missions: 7,
    iban: "ATW ****2295",
    bank: "Attijariwafa",
    status: "done",
    submittedAt: "Il y a 3j",
    waitingHours: 0,
    plan: "Standard",
    processedAt: "Hier 09h30",
  },
  {
    id: "VIR-002",
    artisan: { initials: "SM", color: "#7C3AED", name: "Samir Moussaoui", spec: "Serrurier" },
    amount: 960,
    missions: 4,
    iban: "CIH ****7743",
    bank: "CIH Bank",
    status: "done",
    submittedAt: "Il y a 4j",
    waitingHours: 0,
    plan: "Standard",
    processedAt: "Il y a 2j",
  },
  {
    id: "VIR-001",
    artisan: { initials: "ZM", color: "#B45309", name: "Zineb Mrabet", spec: "Ménage" },
    amount: 720,
    missions: 5,
    iban: "Inwi ****3392",
    bank: "Inwi Money",
    status: "done",
    submittedAt: "Il y a 5j",
    waitingHours: 0,
    plan: "Standard",
    processedAt: "Il y a 3j",
  },
];

export const STATUS_TABS: { id: VirementFilterId; label: string }[] = [
  { id: "all", label: "Tous" },
  { id: "pending", label: "En attente" },
  { id: "processing", label: "En cours" },
  { id: "failed", label: "Échec" },
  { id: "done", label: "Traités" },
];

export const BANK_OPTIONS = [
  "Banque — Toutes",
  "CIH Bank",
  "Attijariwafa",
  "Banque Populaire",
  "BMCE Bank",
  "Orange Money",
  "Inwi Money",
];

export function countByStatus(virements: Virement[], status: VirementStatus): number {
  return virements.filter((v) => v.status === status).length;
}

export function filterVirements(
  virements: Virement[],
  opts: {
    filter: VirementFilterId;
    overdueOnly: boolean;
    bank: string;
  },
): Virement[] {
  return virements
    .filter((v) => opts.filter === "all" || v.status === opts.filter)
    .filter(
      (v) => !opts.overdueOnly || (v.waitingHours >= 24 && v.status === "pending"),
    )
    .filter((v) => opts.bank === "Banque — Toutes" || v.bank === opts.bank);
}

export function pendingTotal(virements: Virement[]): number {
  return virements.filter((v) => v.status === "pending").reduce((s, v) => s + v.amount, 0);
}

export function overduePendingCount(virements: Virement[]): number {
  return virements.filter((v) => v.status === "pending" && v.waitingHours >= 24).length;
}

export function failedCount(virements: Virement[]): number {
  return virements.filter((v) => v.status === "failed").length;
}
