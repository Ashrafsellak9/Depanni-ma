export const COMMISSION_PLANS = [
  {
    plan: "Standard",
    rate: 15,
    artisans: 38,
    color: "#6B7280",
    desc: "Plan gratuit par défaut",
  },
  {
    plan: "Premium",
    rate: 10,
    artisans: 12,
    color: "#F05A1A",
    desc: "150 MAD/mois · commission réduite",
  },
  {
    plan: "Pro",
    rate: 7,
    artisans: 3,
    color: "#1B8A4E",
    desc: "350 MAD/mois · priorité maximale",
  },
];

export const DEPLOYMENT_CITIES = [
  { ville: "El Jadida", status: "active" as const, artisans: 53, label: "Opérationnel" },
  { ville: "Casablanca", status: "coming" as const, artisans: 0, label: "Lancement prévu M5" },
  { ville: "Rabat", status: "planned" as const, artisans: 0, label: "Planifié M8" },
];

export const SERVICES = [
  { emoji: "🔧", name: "Plomberie", active: true, priority: 1 },
  { emoji: "⚡", name: "Électricité", active: true, priority: 2 },
  { emoji: "🔑", name: "Serrurerie", active: true, priority: 3 },
  { emoji: "🚗", name: "Mécanique", active: true, priority: 4 },
  { emoji: "🎨", name: "Peinture", active: true, priority: 5 },
  { emoji: "🧹", name: "Ménage", active: true, priority: 6 },
  { emoji: "🛠️", name: "Électroménager", active: true, priority: 7 },
  { emoji: "🪵", name: "Menuiserie", active: false, priority: 8 },
  { emoji: "🏗️", name: "Maçonnerie", active: false, priority: 9 },
  { emoji: "🌿", name: "Jardinage", active: false, priority: 10 },
];

export const NOTIFICATION_RULES = [
  { label: "Nouvelle inscription artisan", channel: "SMS + Email", active: true },
  { label: "KYC soumis — nouveau dossier", channel: "Email admin", active: true },
  { label: "Litige ouvert", channel: "SMS + Email", active: true },
  { label: "Virement en retard (+24h)", channel: "Email admin", active: true },
  { label: "Artisan note < 3.5/5", channel: "Email admin", active: true },
  { label: "Mission sans artisan > 15 min", channel: "Push admin", active: false },
  { label: "Pic de demandes (>20/h)", channel: "Email admin", active: false },
  { label: "Rapport quotidien automatique", channel: "Email admin", active: true },
];

export const SECURITY_TOGGLES = [
  { label: "Double authentification admin (2FA)", active: true },
  { label: "Session admin expire après 8h", active: true },
  { label: "Bloquer après 5 tentatives échouées", active: true },
  { label: "Log toutes les actions admin", active: true },
];

export const KYC_POLICIES = [
  { label: "CIN obligatoire pour activation", active: true },
  { label: "Photo de profil obligatoire", active: true },
  { label: "Diplôme requis pour certaines spécialités", active: false },
  { label: "Validation manuelle obligatoire (pas d'auto-approve)", active: true },
];

export const ADMIN_TEAM = [
  {
    initials: "AD",
    color: "#0F1E35",
    name: "Admin Principal",
    email: "admin@depanni.ma",
    role: "Super Admin",
    lastLogin: "Aujourd'hui 09h41",
  },
  {
    initials: "MA",
    color: "#7C3AED",
    name: "Mohammed Amrani",
    email: "m.amrani@depanni.ma",
    role: "Modérateur",
    lastLogin: "Hier 16h30",
  },
  {
    initials: "SB",
    color: "#059669",
    name: "Sara Benali",
    email: "s.benali@depanni.ma",
    role: "Finance",
    lastLogin: "Il y a 2j",
  },
];

export type SettingsSectionId =
  | "general"
  | "commissions"
  | "zones"
  | "notifications"
  | "securite"
  | "admins";
