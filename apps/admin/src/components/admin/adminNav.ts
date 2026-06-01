import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Bell,
  ClipboardList,
  HardHat,
  LayoutDashboard,
  Map,
  MessageSquareWarning,
  Search,
  Settings,
  User,
  Wallet,
} from "lucide-react";

export interface NavItemDef {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
  badgeVariant?: "orange" | "red";
}

export interface NavSectionDef {
  title: string;
  items: NavItemDef[];
}

export const ADMIN_NAV: NavSectionDef[] = [
  {
    title: "PRINCIPAL",
    items: [
      { href: "/admin", label: "Vue d'ensemble", icon: LayoutDashboard },
      { href: "/admin/map", label: "Carte en direct", icon: Map },
      { href: "/admin/missions", label: "Missions", icon: ClipboardList, badgeVariant: "orange" },
      { href: "/admin/litiges", label: "Litiges", icon: MessageSquareWarning, badgeVariant: "red" },
    ],
  },
  {
    title: "UTILISATEURS",
    items: [
      { href: "/admin/artisans", label: "Artisans", icon: HardHat, badgeVariant: "orange" },
      { href: "/admin/clients", label: "Clients", icon: User },
      { href: "/admin/kyc", label: "KYC en attente", icon: Search, badgeVariant: "orange" },
    ],
  },
  {
    title: "FINANCES",
    items: [
      { href: "/admin/revenus", label: "Revenus", icon: Wallet },
      { href: "/admin/virements", label: "Virements", icon: Wallet },
      { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
    ],
  },
  {
    title: "CONFIGURATION",
    items: [
      { href: "/admin/parametres", label: "Paramètres", icon: Settings },
      { href: "/admin/notifications", label: "Notifications", icon: Bell },
    ],
  },
];

export const PAGE_TITLES: Record<string, string> = {
  "/admin": "Vue d'ensemble",
  "/admin/map": "Carte en direct",
  "/admin/missions": "Missions",
  "/admin/litiges": "Litiges",
  "/admin/artisans": "Artisans",
  "/admin/clients": "Clients",
  "/admin/kyc": "KYC en attente",
  "/admin/finances": "Revenus",
  "/admin/revenus": "Revenus",
  "/admin/virements": "Virements",
  "/admin/analytics": "Analytics",
  "/admin/settings": "Paramètres",
  "/admin/parametres": "Paramètres",
  "/admin/notifications": "Notifications",
};

export function titleForPath(pathname: string): string {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  if (pathname.startsWith("/admin/missions/")) return "Détail mission";
  if (pathname.startsWith("/admin/artisans/") && pathname !== "/admin/artisans")
    return "Détail artisan";
  if (pathname.startsWith("/admin/litiges/") && pathname !== "/admin/litiges")
    return "Détail litige";
  return "Admin DEPANNI";
}
