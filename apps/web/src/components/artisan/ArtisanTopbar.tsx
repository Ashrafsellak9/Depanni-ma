"use client";

import { Bell, Menu } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

import { StatusToggle } from "@/components/artisan/StatusToggle";
import { titleForPath } from "@/components/artisan/artisanNav";

export function ArtisanTopbar({
  pathname,
  onMenuClick,
}: {
  pathname: string;
  onMenuClick?: () => void;
}) {
  const today = format(new Date(), "EEEE d MMMM yyyy", { locale: fr });
  const title = titleForPath(pathname);

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b border-dep-border bg-white px-4 py-3.5 md:px-6">
      <div className="flex items-center gap-3">
        {onMenuClick && (
          <button
            type="button"
            onClick={onMenuClick}
            className="rounded-lg border border-dep-border bg-cream p-2 lg:hidden"
            aria-label="Menu"
          >
            <Menu className="h-5 w-5 text-navy" />
          </button>
        )}
        <div>
          <h1 className="font-syne text-[18px] font-bold tracking-[-0.3px] text-navy">{title}</h1>
          <p className="text-[11px] capitalize text-dep-gray">{today} · El Jadida</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <StatusToggle />
        <div className="relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-dep-border bg-cream transition-colors hover:bg-cream-2">
          <Bell size={16} className="text-navy" />
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-orange text-[9px] font-bold text-white">
            2
          </span>
        </div>
        <div
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl text-[13px] font-bold text-white"
          style={{ background: "linear-gradient(135deg, #F05A1A, #FF7A3D)" }}
        >
          KA
        </div>
      </div>
    </header>
  );
}
