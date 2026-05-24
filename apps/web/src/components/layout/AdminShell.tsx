"use client";

import { LayoutDashboard, Shield, Users } from "lucide-react";

import { DashboardShell } from "@/components/layout/DashboardShell";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Utilisateurs", icon: Users },
  { href: "/admin/kyc", label: "KYC artisans", icon: Shield },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell title="Administration" navItems={navItems}>
      {children}
    </DashboardShell>
  );
}
