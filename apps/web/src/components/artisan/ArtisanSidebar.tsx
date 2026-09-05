"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Wrench, X } from "lucide-react";

import { ARTISAN_NAV } from "@/components/artisan/artisanNav";
import { cn } from "@/lib/utils";
import { useArtisanAuthStore } from "@/store/artisanAuthStore";

export function ArtisanSidebar({
  open,
  onClose,
}: {
  open?: boolean;
  onClose?: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const name = useArtisanAuthStore((s) => s.name) ?? "Artisan";
  const initials = useArtisanAuthStore((s) => s.initials) ?? "AR";
  const clear = useArtisanAuthStore((s) => s.clear);

  const handleLogout = () => {
    clear();
    router.push("/artisan/login");
  };

  const isActive = (href: string) => {
    if (href === "/artisan") return pathname === "/artisan";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const nav = (
    <>
      <div className="border-b border-white/[0.07] p-5">
        <div className="flex items-center gap-2.5">
          <div className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-[10px] bg-orange">
            <Wrench size={17} className="text-white" />
          </div>
          <div>
            <div className="font-display text-[17px] font-extrabold tracking-[-0.5px] text-white">
              DEPANNI<span className="text-orange">.ma</span>
            </div>
            <div className="font-sans text-[9px] uppercase tracking-[1px] text-white/30">
              Espace artisan
            </div>
          </div>
        </div>
      </div>

      <div className="mx-3 mb-2 mt-4 flex items-center gap-2.5 rounded-xl border border-white/[0.08] bg-white/[0.05] p-3">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] text-[14px] font-bold text-white"
          style={{ background: "linear-gradient(135deg, #F05A1A, #FF7A3D)" }}
        >
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-[13px] font-semibold text-white">{name}</div>
          <div className="mt-0.5 flex items-center gap-1.5">
            <span className="text-[10px] text-white/40">Plombier</span>
            <span className="h-1 w-1 rounded-full bg-green" />
            <span className="text-[10px] font-medium text-[#4ADE80]">Dispo</span>
          </div>
        </div>
        <div className="ml-auto text-[11px] font-bold text-orange">4.9★</div>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-2">
        {ARTISAN_NAV.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "relative flex items-center gap-2.5 rounded-[10px] px-2 py-2.5 text-[13px] font-medium transition-colors",
                active
                  ? "bg-orange/15 text-white"
                  : "text-white/50 hover:bg-white/[0.05] hover:text-white/80",
              )}
            >
              <Icon className={cn("h-4 w-4 shrink-0", active ? "text-orange" : "text-white/45")} />
              <span className="flex-1">{item.label}</span>
              {item.badge != null && item.badge > 0 && (
                <span className="rounded-full bg-orange px-1.5 py-0.5 text-[10px] font-bold text-white">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/[0.07] p-3">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] text-white/40 transition-colors hover:bg-white/[0.05] hover:text-white"
        >
          <LogOut size={16} />
          Déconnexion
        </button>
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
