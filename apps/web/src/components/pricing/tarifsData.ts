import type { FaqItem } from "@/components/landing/faqData";

export type TarifsAudience = "client" | "artisan";

export const CLIENT_PERKS = [
  "Aucun frais d'inscription, aucun abonnement",
  "Devis toujours gratuit avant intervention",
  "Paiement uniquement après validation du travail",
  "Support 7\u00a0j/7 inclus par WhatsApp et email",
] as const;

export const COMMISSION_BREAKDOWN = [
  { label: "Vérification et sécurité", pct: 30, color: "#D9451F" },
  { label: "Support et médiation", pct: 25, color: "#C9A87A" },
  { label: "Infrastructure et paiement", pct: 20, color: "#A8320F" },
  { label: "Développement produit", pct: 25, color: "#1E3149" },
] as const;

export const TARIFS_FAQ: FaqItem[] = [
  {
    id: "changer",
    question: "Puis-je changer de plan à tout moment\u00a0?",
    lead: "Oui, à tout moment depuis votre espace artisan.",
    body: "Le changement prend effet immédiatement et le prorata est calculé automatiquement.",
  },
  {
    id: "caches",
    question: "Y a-t-il des frais cachés\u00a0?",
    lead: "Aucun. Le prix affiché est le prix payé.",
    body: "Aucun frais de mise en service, aucun frais de retrait, aucun frais de facturation.",
  },
  {
    id: "commissions",
    question: "Comment sont calculées les commissions\u00a0?",
    lead: "La commission est un pourcentage du montant total facturé au client, hors TVA.",
    body: "Elle est prélevée automatiquement au moment du paiement.",
  },
  {
    id: "resilier",
    question: "Puis-je résilier à tout moment\u00a0?",
    lead: "Oui, sans préavis et sans frais pour les plans Standard et Premium.",
    body: "Le plan Pro peut avoir un préavis de 30 jours selon les conditions négociées.",
  },
  {
    id: "paiement",
    question: "Quels moyens de paiement sont acceptés pour l'abonnement Premium\u00a0?",
    lead: "Carte bancaire (Visa, Mastercard, CMI) et virement bancaire mensuel ou annuel.",
    body: "Le renouvellement est automatique, annulable à tout moment.",
  },
];

export type CompareCell =
  | { kind: "check" }
  | { kind: "cross" }
  | { kind: "text"; value: string };

export type CompareRow = {
  feature: string;
  standard: CompareCell;
  premium: CompareCell;
  pro: CompareCell;
};

export type CompareSection = {
  title: string;
  rows: CompareRow[];
};

export const COMPARE_SECTIONS: CompareSection[] = [
  {
    title: "Missions",
    rows: [
      {
        feature: "Missions par mois",
        standard: { kind: "text", value: "Illimité" },
        premium: { kind: "text", value: "Illimité" },
        pro: { kind: "text", value: "Illimité" },
      },
      {
        feature: "Commission par mission",
        standard: { kind: "text", value: "15\u00a0%" },
        premium: { kind: "text", value: "10\u00a0%" },
        pro: { kind: "text", value: "7\u00a0%" },
      },
      {
        feature: "Priorité sur les alertes",
        standard: { kind: "cross" },
        premium: { kind: "check" },
        pro: { kind: "check" },
      },
      {
        feature: "Zone d'intervention",
        standard: { kind: "text", value: "1 quartier" },
        premium: { kind: "text", value: "3 quartiers" },
        pro: { kind: "text", value: "Toute la ville" },
      },
    ],
  },
  {
    title: "Visibilité",
    rows: [
      {
        feature: "Badge sur le profil",
        standard: { kind: "text", value: "Vérifié" },
        premium: { kind: "text", value: "Premium" },
        pro: { kind: "text", value: "Pro Elite" },
      },
      {
        feature: "Photos avant/après",
        standard: { kind: "text", value: "3 par mission" },
        premium: { kind: "text", value: "Illimité" },
        pro: { kind: "text", value: "Illimité" },
      },
      {
        feature: "Mise en avant dans les résultats",
        standard: { kind: "cross" },
        premium: { kind: "check" },
        pro: { kind: "text", value: "Oui + top 3" },
      },
      {
        feature: "Vidéo de présentation",
        standard: { kind: "cross" },
        premium: { kind: "cross" },
        pro: { kind: "check" },
      },
    ],
  },
  {
    title: "Paiement & finance",
    rows: [
      {
        feature: "Délai de versement",
        standard: { kind: "text", value: "7 jours" },
        premium: { kind: "text", value: "48\u00a0h" },
        pro: { kind: "text", value: "24\u00a0h" },
      },
      {
        feature: "Facturation client",
        standard: { kind: "text", value: "Standard" },
        premium: { kind: "text", value: "Personnalisée" },
        pro: { kind: "text", value: "Sur mesure" },
      },
      {
        feature: "Historique et rapports",
        standard: { kind: "text", value: "Basique" },
        premium: { kind: "text", value: "Détaillé" },
        pro: { kind: "text", value: "Exportable" },
      },
      {
        feature: "API de facturation",
        standard: { kind: "cross" },
        premium: { kind: "cross" },
        pro: { kind: "check" },
      },
    ],
  },
  {
    title: "Support",
    rows: [
      {
        feature: "Support client",
        standard: { kind: "text", value: "Email" },
        premium: { kind: "text", value: "WhatsApp prioritaire" },
        pro: { kind: "text", value: "Manager dédié" },
      },
      {
        feature: "Formation",
        standard: { kind: "cross" },
        premium: { kind: "text", value: "Vidéos" },
        pro: { kind: "text", value: "Sessions live" },
      },
      {
        feature: "Résolution des litiges",
        standard: { kind: "text", value: "72\u00a0h" },
        premium: { kind: "text", value: "24\u00a0h" },
        pro: { kind: "text", value: "12\u00a0h" },
      },
    ],
  },
  {
    title: "Engagement",
    rows: [
      {
        feature: "Durée d'engagement",
        standard: { kind: "text", value: "Aucun" },
        premium: { kind: "text", value: "Aucun" },
        pro: { kind: "text", value: "Négociable" },
      },
      {
        feature: "Résiliation",
        standard: { kind: "text", value: "Immédiate" },
        premium: { kind: "text", value: "Immédiate" },
        pro: { kind: "text", value: "Préavis 30\u00a0j" },
      },
    ],
  },
];
