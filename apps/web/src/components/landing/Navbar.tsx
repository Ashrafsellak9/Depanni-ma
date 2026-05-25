"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { AUTH_ROUTES } from "@/lib/auth";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "#services", label: "Services" },
  { href: "/comment-ca-marche", label: "Comment ça marche" },
  { href: "#artisans", label: "Devenir artisan" },
  { href: "#el-jadida", label: "El Jadida" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "border-b border-dep-border/80 bg-cream/90 shadow-sm backdrop-blur-md" : "bg-transparent",
      )}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:h-[72px]">
        <Link href="/" className="font-syne text-xl font-extrabold tracking-tight text-navy md:text-2xl">
          DEPANNI<span className="text-orange">.ma</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-navy/80 transition-colors hover:text-orange"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          href={AUTH_ROUTES.newRequest}
          className="hidden rounded-full bg-orange px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-orange-2 md:inline-flex"
        >
          Demander un artisan →
        </Link>

        <button
          type="button"
          className="inline-flex rounded-lg p-2 text-navy md:hidden"
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <div
        className={cn(
          "overflow-hidden border-t border-dep-border bg-cream/98 backdrop-blur-md transition-all duration-300 md:hidden",
          open ? "max-h-[420px] opacity-100" : "max-h-0 opacity-0 border-t-0",
        )}
      >
        <nav className="flex flex-col gap-1 px-4 py-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-3 text-base font-medium text-navy hover:bg-cream-2"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={AUTH_ROUTES.newRequest}
            className="mt-2 rounded-full bg-orange px-5 py-3 text-center text-sm font-medium text-white hover:bg-orange-2"
            onClick={() => setOpen(false)}
          >
            Demander un artisan →
          </Link>
        </nav>
      </div>
    </header>
  );
}
