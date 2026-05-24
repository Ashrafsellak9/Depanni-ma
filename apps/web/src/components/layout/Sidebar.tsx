"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { useUiStore } from "@/store/uiStore";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

interface SidebarProps {
  items: NavItem[];
  title: string;
}

export function Sidebar({ items, title }: SidebarProps) {
  const pathname = usePathname();
  const sidebarOpen = useUiStore((s) => s.sidebarOpen);

  return (
    <aside
      className={cn(
        "flex h-full flex-col border-r bg-surface transition-all duration-200",
        sidebarOpen ? "w-64" : "w-16",
      )}
    >
      <div className="flex h-16 items-center border-b px-4">
        <span
          className={cn(
            "truncate font-bold text-navy transition-opacity",
            !sidebarOpen && "opacity-0",
          )}
        >
          {title}
        </span>
      </div>
      <nav className="flex-1 space-y-1 p-2">
        {items.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-navy hover:bg-primary/10 hover:text-primary",
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
