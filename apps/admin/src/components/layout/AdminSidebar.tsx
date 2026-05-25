"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AlertTriangle,
  BarChart3,
  ClipboardList,
  LayoutDashboard,
  Map,
  Settings,
  Shield,
  Users,
  Wallet,
  Wrench,
} from "lucide-react";

import { cn } from "@/lib/utils";

export interface NavBadgeCounts {
  missions?: number;
  disputes?: number;
  kyc?: number;
}

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  badgeVariant?: "default" | "danger";
}

interface NavSection {
  title: string;
  items: NavItem[];
}

function buildSections(counts: NavBadgeCounts): NavSection[] {
  return [
    {
      title: "Principal",
      items: [
        { href: "/", label: "Vue d'ensemble", icon: LayoutDashboard },
        { href: "/carte", label: "Carte en direct", icon: Map },
        {
          href: "/missions",
          label: "Missions",
          icon: ClipboardList,
          badge: counts.missions,
        },
        {
          href: "/finances/litiges",
          label: "Litiges",
          icon: AlertTriangle,
          badge: counts.disputes,
          badgeVariant: "danger",
        },
      ],
    },
    {
      title: "Utilisateurs",
      items: [
        { href: "/artisans", label: "Artisans", icon: Wrench },
        { href: "/clients", label: "Clients", icon: Users },
        {
          href: "/artisans/kyc",
          label: "KYC en attente",
          icon: Shield,
          badge: counts.kyc,
        },
      ],
    },
    {
      title: "Finances",
      items: [
        { href: "/finances/revenus", label: "Revenus", icon: Wallet },
        { href: "/finances/virements", label: "Virements", icon: Wallet },
        { href: "/analytics", label: "Analytics", icon: BarChart3 },
      ],
    },
    {
      title: "Config",
      items: [
        { href: "/parametres", label: "Paramètres", icon: Settings },
        { href: "/notifications", label: "Notifications", icon: Settings },
      ],
    },
  ];
}

export function AdminSidebar({ counts = {} }: { counts?: NavBadgeCounts }) {
  const pathname = usePathname();
  const sections = buildSections(counts);

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-slate-200 bg-slate-900 text-white">
      <div className="border-b border-slate-700 px-5 py-5">
        <p className="text-lg font-bold tracking-tight">DEPANNI</p>
        <p className="text-xs text-slate-400">Administration</p>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {sections.map((section) => (
          <div key={section.title} className="mb-6">
            <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              {section.title}
            </p>
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const active =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname === item.href || pathname.startsWith(`${item.href}/`);
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                        active
                          ? "bg-slate-700 text-white"
                          : "text-slate-300 hover:bg-slate-800 hover:text-white",
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="flex-1">{item.label}</span>
                      {item.badge != null && item.badge > 0 && (
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 text-[10px] font-bold",
                            item.badgeVariant === "danger"
                              ? "bg-red-500 text-white"
                              : "bg-amber-500 text-slate-900",
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
