export type NotificationType = "kyc" | "litige" | "virement" | "artisan" | "system";
export type InboxFilterId = "all" | NotificationType;
export type NotificationTabId = "inbox" | "compose" | "history";

export type AdminNotification = {
  id: string;
  read: boolean;
  type: NotificationType;
  priority: "urgent" | "normal";
  icon: string;
  color: string;
  title: string;
  message: string;
  time: string;
  action: { label: string; href: string } | null;
};

export const MOCK_NOTIFICATIONS: AdminNotification[] = [
  {
    id: "N-018",
    read: false,
    type: "kyc",
    priority: "urgent",
    icon: "🔍",
    color: "#F05A1A",
    title: "KYC en retard critique",
    message: "Fatima Ouhsaine attend depuis 71h — objectif 48h dépassé. Action requise.",
    time: "Il y a 8 min",
    action: { label: "Traiter KYC", href: "/admin/kyc" },
  },
  {
    id: "N-017",
    read: false,
    type: "litige",
    priority: "urgent",
    icon: "⚠️",
    color: "#DC2626",
    title: "Litige LIT-007 — 78h sans résolution",
    message: "Omar Kettani vs Khalid Amrani · Plomberie · 190 MAD contestés.",
    time: "Il y a 23 min",
    action: { label: "Voir litige", href: "/admin/litiges" },
  },
  {
    id: "N-016",
    read: false,
    type: "virement",
    priority: "normal",
    icon: "🏦",
    color: "#DC2626",
    title: "Virement en échec",
    message: "Nadia Bensouda · 1 530 MAD · IBAN invalide. Correction requise.",
    time: "Il y a 1h",
    action: { label: "Corriger IBAN", href: "/admin/virements" },
  },
  {
    id: "N-015",
    read: true,
    type: "kyc",
    priority: "normal",
    icon: "👷",
    color: "#7C3AED",
    title: "Nouveau dossier KYC soumis",
    message: "Ahmed Benmoussa (Plombier) a soumis son dossier complet (100%).",
    time: "Il y a 3h",
    action: { label: "Examiner", href: "/admin/kyc" },
  },
  {
    id: "N-014",
    read: true,
    type: "artisan",
    priority: "normal",
    icon: "⭐",
    color: "#B45309",
    title: "Artisan sous note minimale",
    message: "Fouad El Idrissi · Note 3.2/5 (seuil: 3.5). Surveillance recommandée.",
    time: "Il y a 5h",
    action: { label: "Voir profil", href: "/admin/artisans" },
  },
  {
    id: "N-013",
    read: true,
    type: "system",
    priority: "normal",
    icon: "📊",
    color: "#1B8A4E",
    title: "Rapport quotidien — Lundi 27 Avril",
    message: "47 missions · 18 200 MAD GMV · 4.8/5 satisfaction · 0 incident critique.",
    time: "Hier 08h00",
    action: { label: "Voir analytics", href: "/admin/analytics" },
  },
  {
    id: "N-012",
    read: true,
    type: "kyc",
    priority: "normal",
    icon: "✅",
    color: "#1B8A4E",
    title: "KYC approuvé — Khalid Amrani",
    message: "Compte activé avec succès. Premier artisan plombier opérationnel.",
    time: "Hier 11h30",
    action: null,
  },
  {
    id: "N-011",
    read: true,
    type: "virement",
    priority: "normal",
    icon: "💰",
    color: "#1B8A4E",
    title: "4 virements traités avec succès",
    message: "Total : 8 760 MAD virés à Khalid A., Omar B., Saad K., Yassine M.",
    time: "Hier 09h00",
    action: { label: "Voir virements", href: "/admin/virements" },
  },
  {
    id: "N-010",
    read: true,
    type: "litige",
    priority: "normal",
    icon: "✓",
    color: "#1B8A4E",
    title: "Litige LIT-002 résolu",
    message: "Remboursement de 150 MAD accordé à Layla Bennis. Artisan averti.",
    time: "Il y a 2j",
    action: null,
  },
  {
    id: "N-009",
    read: true,
    type: "system",
    priority: "normal",
    icon: "🚀",
    color: "#0891B2",
    title: "Pic d'activité détecté",
    message: "24 demandes en 1h — record de la semaine. Zone Hay Hassani en forte demande.",
    time: "Il y a 2j 14h00",
    action: { label: "Voir heatmap", href: "/admin/analytics" },
  },
];

export const INBOX_FILTERS: { id: InboxFilterId; label: string }[] = [
  { id: "all", label: "Toutes" },
  { id: "kyc", label: "KYC" },
  { id: "litige", label: "Litiges" },
  { id: "virement", label: "Virements" },
  { id: "artisan", label: "Artisans" },
  { id: "system", label: "Système" },
];

export const AUDIENCE_OPTIONS = [
  { id: "all_clients", label: "Tous les clients", icon: "👤", count: "1 240" },
  { id: "all_artisans", label: "Tous les artisans", icon: "👷", count: "280" },
  { id: "active_artisans", label: "Artisans actifs", icon: "🟢", count: "38" },
  { id: "pending_kyc", label: "KYC en attente", icon: "🔍", count: "7" },
  { id: "inactive", label: "Clients inactifs (30j)", icon: "😴", count: "142" },
  { id: "custom", label: "Sélection manuelle", icon: "✏️", count: null },
];

export const AUDIENCE_COUNTS: Record<string, number> = {
  all_clients: 1240,
  all_artisans: 280,
  active_artisans: 38,
  pending_kyc: 7,
  inactive: 142,
  custom: 0,
};

export const QUICK_TEMPLATES = [
  {
    title: "Rappel inactivité",
    message: "Vous manquez à vos artisans ! Faites une demande dès maintenant.",
  },
  {
    title: "Nouvelle fonctionnalité",
    message: "DEPANNI.ma s'améliore pour vous. Découvrez les nouveautés.",
  },
  {
    title: "Promo week-end",
    message: "Ce week-end, bénéficiez d'artisans disponibles à tarifs réduits.",
  },
];

export type SendHistoryEntry = {
  id: string;
  title: string;
  audience: string;
  channels: ("push" | "sms" | "email")[];
  count: number;
  sentAt: string;
  openRate: number;
  status: "sent";
};

export const SEND_HISTORY: SendHistoryEntry[] = [
  {
    id: "S-008",
    title: "Rappel artisans KYC en attente",
    audience: "KYC en attente",
    channels: ["push", "sms"],
    count: 7,
    sentAt: "Aujourd'hui 10h00",
    openRate: 85,
    status: "sent",
  },
  {
    id: "S-007",
    title: "Rapport quotidien admin",
    audience: "Admin",
    channels: ["email"],
    count: 1,
    sentAt: "Aujourd'hui 08h00",
    openRate: 100,
    status: "sent",
  },
  {
    id: "S-006",
    title: "Bienvenue sur DEPANNI.ma !",
    audience: "Nouveaux clients",
    channels: ["push", "email"],
    count: 5,
    sentAt: "Hier 14h30",
    openRate: 80,
    status: "sent",
  },
  {
    id: "S-005",
    title: "Votre mission est terminée",
    audience: "Clients post-mission",
    channels: ["push"],
    count: 12,
    sentAt: "Hier 11h00",
    openRate: 91,
    status: "sent",
  },
  {
    id: "S-004",
    title: "Maintenance prévue ce soir",
    audience: "Tous",
    channels: ["push", "sms", "email"],
    count: 1520,
    sentAt: "Il y a 3j",
    openRate: 72,
    status: "sent",
  },
  {
    id: "S-003",
    title: "Promo week-end artisans",
    audience: "Tous artisans",
    channels: ["push", "sms"],
    count: 53,
    sentAt: "Il y a 5j",
    openRate: 64,
    status: "sent",
  },
  {
    id: "S-002",
    title: "Nouveau service : Jardinage",
    audience: "Clients El Jadida",
    channels: ["push", "email"],
    count: 340,
    sentAt: "Il y a 1 sem.",
    openRate: 45,
    status: "sent",
  },
  {
    id: "S-001",
    title: "Test notification système",
    audience: "Admin seulement",
    channels: ["push"],
    count: 1,
    sentAt: "Il y a 2 sem.",
    openRate: 100,
    status: "sent",
  },
];

export const HISTORY_KPIS = [
  { label: "Envois ce mois", value: 8 },
  { label: "Total destinataires", value: "1 939" },
  { label: "Taux ouverture moy.", value: "72%" },
  { label: "SMS envoyés", value: 61 },
];

export function filterNotifications(
  notifications: AdminNotification[],
  filter: InboxFilterId,
): AdminNotification[] {
  if (filter === "all") return notifications;
  return notifications.filter((n) => n.type === filter);
}

export function countByType(
  notifications: AdminNotification[],
  type: NotificationType | "all",
): number {
  if (type === "all") return notifications.length;
  return notifications.filter((n) => n.type === type).length;
}

export function unreadCount(notifications: AdminNotification[]): number {
  return notifications.filter((n) => !n.read).length;
}
