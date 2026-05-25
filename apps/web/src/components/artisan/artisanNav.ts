import type { LucideIcon } from "lucide-react";
import {
  ClipboardList,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Star,
  UserCircle,
  Wallet,
} from "lucide-react";

export interface ArtisanNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
}

export const ARTISAN_NAV: ArtisanNavItem[] = [
  { href: "/artisan", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/artisan/missions", label: "Missions", icon: ClipboardList, badge: 2 },
  { href: "/artisan/revenus", label: "Revenus", icon: Wallet },
  { href: "/artisan/profil", label: "Mon profil", icon: UserCircle },
  { href: "/artisan/avis", label: "Mes avis", icon: Star },
  { href: "/artisan/aide", label: "Aide", icon: HelpCircle },
];

export const PAGE_TITLES: Record<string, string> = {
  "/artisan": "Tableau de bord",
  "/artisan/missions": "Missions",
  "/artisan/revenus": "Revenus",
  "/artisan/profil": "Mon profil",
  "/artisan/avis": "Mes avis",
  "/artisan/aide": "Aide",
};

export function titleForPath(pathname: string): string {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  if (pathname.startsWith("/artisan/missions/")) return "Détail mission";
  return "Espace artisan";
}
