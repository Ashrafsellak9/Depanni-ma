export type KycDocStatus = "uploaded" | "missing";

export type KycDocument = {
  status: KycDocStatus;
  name: string | null;
};

export type KycDossier = {
  id: string;
  artisanId: string;
  initials: string;
  color: string;
  name: string;
  spec: string;
  specEmoji: string;
  phone: string;
  city: string;
  submittedAt: string;
  waitingHours: number;
  documents: {
    cin_front: KycDocument;
    cin_back: KycDocument;
    photo: KycDocument;
    diploma: KycDocument;
  };
  completeness: number;
  priority: "normal" | "urgent";
  notes: string;
};

export const KYC_KPIS = [
  {
    label: "En attente",
    value: 7,
    suffix: "",
    change: "À traiter aujourd'hui",
    trend: "up" as const,
    icon: "Clock",
    iconBg: "orange" as const,
  },
  {
    label: "Délai moyen",
    value: "18h",
    isString: true,
    suffix: "",
    change: "Objectif < 48h",
    trend: "up" as const,
    icon: "Timer",
    iconBg: "navy" as const,
  },
  {
    label: "Taux approbation",
    value: "87%",
    isString: true,
    suffix: "",
    change: "Ce mois",
    trend: "up" as const,
    icon: "CheckCircle",
    iconBg: "green" as const,
  },
  {
    label: "Approuvés / Refusés",
    value: "24 / 4",
    isString: true,
    suffix: "",
    change: "Ce mois",
    trend: "up" as const,
    icon: "BarChart2",
    iconBg: "purple" as const,
  },
];

export const MOCK_KYC_DOSSIERS: KycDossier[] = [
  {
    id: "KYC-007",
    artisanId: "A-004",
    initials: "RF",
    color: "#DC2626",
    name: "Rachid El Filali",
    spec: "Électricité",
    specEmoji: "⚡",
    phone: "+212 6 11 11 11 11",
    city: "El Jadida",
    submittedAt: "Aujourd'hui 09h15",
    waitingHours: 3,
    documents: {
      cin_front: { status: "uploaded", name: "CIN_recto_RF.jpg" },
      cin_back: { status: "uploaded", name: "CIN_verso_RF.jpg" },
      photo: { status: "uploaded", name: "photo_profil_RF.jpg" },
      diploma: { status: "uploaded", name: "attestation_electricien.pdf" },
    },
    completeness: 100,
    priority: "normal",
    notes: "",
  },
  {
    id: "KYC-006",
    artisanId: "A-007",
    initials: "SM",
    color: "#7C3AED",
    name: "Samir Moussaoui",
    spec: "Serrurerie",
    specEmoji: "🔑",
    phone: "+212 6 22 22 22 22",
    city: "El Jadida Centre",
    submittedAt: "Hier 16h30",
    waitingHours: 17,
    documents: {
      cin_front: { status: "uploaded", name: "CIN_recto_SM.jpg" },
      cin_back: { status: "uploaded", name: "CIN_verso_SM.jpg" },
      photo: { status: "uploaded", name: "photo_SM.jpg" },
      diploma: { status: "missing", name: null },
    },
    completeness: 75,
    priority: "normal",
    notes: "",
  },
  {
    id: "KYC-005",
    artisanId: "A-012",
    initials: "AB",
    color: "#0891B2",
    name: "Ahmed Benmoussa",
    spec: "Plomberie",
    specEmoji: "🔧",
    phone: "+212 6 33 33 33 33",
    city: "Hay Hassani",
    submittedAt: "Hier 10h00",
    waitingHours: 24,
    documents: {
      cin_front: { status: "uploaded", name: "CIN_recto_AB.jpg" },
      cin_back: { status: "uploaded", name: "CIN_verso_AB.jpg" },
      photo: { status: "uploaded", name: "photo_AB.jpg" },
      diploma: { status: "uploaded", name: "diplome_plomberie_AB.pdf" },
    },
    completeness: 100,
    priority: "urgent",
    notes: "Artisan très motivé, a appelé 2 fois pour suivre son dossier",
  },
  {
    id: "KYC-004",
    artisanId: "A-013",
    initials: "HE",
    color: "#059669",
    name: "Hamid El Ouafi",
    spec: "Mécanique",
    specEmoji: "🚗",
    phone: "+212 6 44 44 44 44",
    city: "Zone Industrielle",
    submittedAt: "Il y a 2j",
    waitingHours: 48,
    documents: {
      cin_front: { status: "uploaded", name: "CIN_recto_HE.jpg" },
      cin_back: { status: "missing", name: null },
      photo: { status: "uploaded", name: "photo_HE.jpg" },
      diploma: { status: "missing", name: null },
    },
    completeness: 50,
    priority: "urgent",
    notes: "",
  },
  {
    id: "KYC-003",
    artisanId: "A-014",
    initials: "NB",
    color: "#B45309",
    name: "Noureddine Bakkali",
    spec: "Peinture",
    specEmoji: "🎨",
    phone: "+212 6 55 55 55 55",
    city: "Cité Essalam",
    submittedAt: "Il y a 2j",
    waitingHours: 52,
    documents: {
      cin_front: { status: "uploaded", name: "CIN_recto_NB.jpg" },
      cin_back: { status: "uploaded", name: "CIN_verso_NB.jpg" },
      photo: { status: "uploaded", name: "photo_NB.jpg" },
      diploma: { status: "missing", name: null },
    },
    completeness: 75,
    priority: "urgent",
    notes: "",
  },
  {
    id: "KYC-002",
    artisanId: "A-015",
    initials: "FO",
    color: "#F05A1A",
    name: "Fatima Ouhsaine",
    spec: "Ménage",
    specEmoji: "🧹",
    phone: "+212 6 66 66 66 66",
    city: "El Jadida",
    submittedAt: "Il y a 3j",
    waitingHours: 71,
    documents: {
      cin_front: { status: "uploaded", name: "CIN_recto_FO.jpg" },
      cin_back: { status: "uploaded", name: "CIN_verso_FO.jpg" },
      photo: { status: "uploaded", name: "photo_FO.jpg" },
      diploma: { status: "uploaded", name: "attestation_menage_FO.pdf" },
    },
    completeness: 100,
    priority: "urgent",
    notes: "En attente depuis 3j — priorité absolue",
  },
  {
    id: "KYC-001",
    artisanId: "A-016",
    initials: "KO",
    color: "#1E3A5F",
    name: "Khalid Ouazzani",
    spec: "Maçonnerie",
    specEmoji: "🏗️",
    phone: "+212 6 77 77 77 77",
    city: "Sidi Bouzid",
    submittedAt: "Il y a 3j",
    waitingHours: 74,
    documents: {
      cin_front: { status: "uploaded", name: "CIN_recto_KO.jpg" },
      cin_back: { status: "uploaded", name: "CIN_verso_KO.jpg" },
      photo: { status: "missing", name: null },
      diploma: { status: "missing", name: null },
    },
    completeness: 50,
    priority: "urgent",
    notes: "",
  },
];

export const RECENTLY_PROCESSED = [
  {
    initials: "KA",
    color: "#F05A1A",
    name: "Khalid Amrani",
    spec: "🔧 Plomberie",
    decision: "approved" as const,
    date: "Hier 11h30",
    by: "Admin",
    delay: "14h",
  },
  {
    initials: "OB",
    color: "#7C3AED",
    name: "Omar Benali",
    spec: "⚡ Électricité",
    decision: "approved" as const,
    date: "Hier 09h00",
    by: "Admin",
    delay: "22h",
  },
  {
    initials: "ZM",
    color: "#DC2626",
    name: "Zineb Mrabet",
    spec: "🧹 Ménage",
    decision: "rejected" as const,
    date: "Il y a 2j",
    by: "Admin",
    delay: "8h",
  },
  {
    initials: "YK",
    color: "#059669",
    name: "Yassine Kadiri",
    spec: "🎨 Peinture",
    decision: "approved" as const,
    date: "Il y a 2j",
    by: "Admin",
    delay: "31h",
  },
];

export type KycFilterId = "all" | "urgent" | "complete" | "incomplete";

export const KYC_FILTER_TABS = [
  { id: "all" as const, label: "Tous", count: 7 },
  { id: "urgent" as const, label: "🚨 Urgents", count: 4 },
  { id: "complete" as const, label: "✓ Complets", count: 3 },
  { id: "incomplete" as const, label: "⚠ Incomplets", count: 4 },
];

export function filterKycDossiers(dossiers: KycDossier[], filter: KycFilterId): KycDossier[] {
  if (filter === "urgent") return dossiers.filter((d) => d.waitingHours >= 48);
  if (filter === "complete") return dossiers.filter((d) => d.completeness === 100);
  if (filter === "incomplete") return dossiers.filter((d) => d.completeness < 100);
  return dossiers;
}

export const DOC_KEYS = [
  { key: "cin_front" as const, label: "CIN R." },
  { key: "cin_back" as const, label: "CIN V." },
  { key: "photo" as const, label: "Photo" },
  { key: "diploma" as const, label: "Dipôme" },
];

export const REJECT_REASONS = [
  "Document illisible ou de mauvaise qualité",
  "Document expiré",
  "Photo de profil non conforme",
  "Identité non vérifiable",
  "Dossier incomplet — documents manquants",
];
