"use client";

import { Home, MapPin, PlusCircle, User } from "lucide-react";

import { DashboardShell } from "@/components/layout/DashboardShell";

const navItems = [
  { href: "/dashboard", label: "Accueil", icon: Home },
  { href: "/request/new", label: "Nouvelle demande", icon: PlusCircle },
  { href: "/missions", label: "Historique", icon: MapPin },
  { href: "/profile", label: "Profil", icon: User },
];

export function CitizenShell({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell title="Espace citoyen" navItems={navItems}>
      {children}
    </DashboardShell>
  );
}
