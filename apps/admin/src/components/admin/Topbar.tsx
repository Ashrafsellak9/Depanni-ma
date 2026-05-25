"use client";

import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Bell, Menu, Search } from "lucide-react";

import { titleForPath } from "@/components/admin/adminNav";
import { cn } from "@/lib/utils";

export function Topbar({
  pathname,
  onMenuClick,
}: {
  pathname: string;
  onMenuClick?: () => void;
}) {
  const dateLabel = format(new Date(2026, 3, 27), "EEEE d MMMM yyyy", { locale: fr });
  const capitalized = dateLabel.charAt(0).toUpperCase() + dateLabel.slice(1);

  return (
    <header className="sticky top-0 z-10 flex h-[60px] items-center justify-between gap-4 border-b border-dep-border bg-white px-4 md:px-7">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="rounded-lg border border-dep-border bg-cream p-2 lg:hidden"
          onClick={onMenuClick}
          aria-label="Menu"
        >
          <Menu className="h-5 w-5 text-navy" />
        </button>
        <h1 className="font-syne text-xl font-bold text-navy">{titleForPath(pathname)}</h1>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <p className="hidden text-xs text-dep-gray md:block">🗓 {capitalized}</p>

        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-dep-gray" />
          <input
            type="search"
            placeholder="Rechercher artisan, client, mission..."
            className="h-10 w-48 rounded-xl border border-dep-border bg-cream pl-9 pr-3 text-sm outline-none ring-orange/30 focus:ring-2 md:w-72"
          />
        </div>

        <button
          type="button"
          className={cn(
            "relative flex h-10 w-10 items-center justify-center rounded-xl border border-dep-border bg-cream",
          )}
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4 text-navy" />
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-orange text-[9px] font-bold text-white">
            3
          </span>
        </button>
      </div>
    </header>
  );
}
