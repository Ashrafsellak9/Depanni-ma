"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";

import { ADMIN_NAV } from "@/components/admin/adminNav";
import { useAdminNavBadges } from "@/context/AdminNavBadges";
import { cn } from "@/lib/utils";

export function Sidebar({
  open,
  onClose,
}: {
  open?: boolean;
  onClose?: () => void;
}) {
  const pathname = usePathname();
  const badges = useAdminNavBadges();

  const badgeFor = (href: string, fallback?: number) => {
    if (href === "/admin/missions") return badges.missions ?? fallback;
    if (href === "/admin/litiges") return badges.disputes ?? fallback;
    if (href === "/admin/artisans" || href === "/admin/kyc") return badges.kyc ?? fallback;
    return fallback;
  };

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const nav = (
    <>
      <div className="border-b border-white/[0.07] px-5 py-5">
        <p className="font-syne text-xl font-extrabold">
          <span className="text-white">DEPANNI</span>
          <span className="text-[#F05A1A]">.ma</span>
        </p>
        <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.2em] text-white/30">
          Admin Dashboard
        </p>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
        {ADMIN_NAV.map((section) => (
          <div key={section.title}>
            <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-white/30">
              {section.title}
            </p>
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const active = isActive(item.href);
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className={cn(
                        "flex items-center gap-2.5 rounded-[10px] px-2 py-2.5 text-[13px] font-medium transition-colors",
                        active
                          ? "bg-orange/15 text-white"
                          : "text-white/55 hover:bg-white/[0.06] hover:text-white/80",
                      )}
                    >
                      <Icon
                        className={cn("h-4 w-4 shrink-0", active ? "text-orange" : "text-white/45")}
                      />
                      <span className="flex-1">{item.label}</span>
                      {(() => {
                        const n = badgeFor(item.href, item.badge);
                        if (n == null || n <= 0) return null;
                        return (
                        <span
                          className={cn(
                            "rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                            item.badgeVariant === "red"
                              ? "bg-dep-red text-white"
                              : "bg-orange text-white",
                          )}
                        >
                          {n}
                        </span>
                        );
                      })()}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/[0.07] p-4">
        <div className="flex items-center gap-3 rounded-xl bg-white/[0.06] px-3 py-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange font-bold text-white">
            AD
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Admin DEPANNI</p>
            <p className="text-[11px] text-white/35">Super Administrateur</p>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      <aside className="hidden h-screen w-[220px] shrink-0 flex-col bg-navy lg:flex">{nav}</aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-navy/60 backdrop-blur-sm"
            aria-label="Fermer le menu"
            onClick={onClose}
          />
          <aside className="relative flex h-full w-[220px] flex-col bg-navy shadow-2xl">
            <button
              type="button"
              className="absolute right-3 top-4 rounded-lg p-1 text-white/70 hover:bg-white/10"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </button>
            {nav}
          </aside>
        </div>
      )}
    </>
  );
}
