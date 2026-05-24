"use client";

import { Home, MapPin, User, Wallet } from "lucide-react";

import { DashboardShell } from "@/components/layout/DashboardShell";

const navItems = [
  { href: "/artisan/dashboard", label: "Tableau de bord", icon: Home },
  { href: "/artisan/missions", label: "Missions", icon: MapPin },
  { href: "/artisan/earnings", label: "Revenus", icon: Wallet },
  { href: "/artisan/profile", label: "Profil", icon: User },
];

export function ArtisanShell({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell title="Espace artisan" navItems={navItems}>
      {children}
    </DashboardShell>
  );
}
