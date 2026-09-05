"use client";

import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { ArrowRight } from "@/components/landing/ui/ArrowRight";
import { LandingButton } from "@/components/landing/ui/LandingButton";
import { RequestCta } from "@/components/landing/ui/RequestCta";
import { HOW_IT_WORKS_ARTISAN_TAB } from "@/lib/siteConstants";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/#services", label: "Services", match: (p: string) => p === "/" },
  { href: "/comment-ca-marche", label: "Comment ça marche", match: (p: string) => p === "/comment-ca-marche" },
  { href: "/tarifs", label: "Tarifs", match: (p: string) => p === "/tarifs" || p === "/prix" },
  { href: HOW_IT_WORKS_ARTISAN_TAB, label: "Devenir artisan", match: () => false },
  { href: "/#el-jadida", label: "El Jadida", match: () => false },
];

export function Navbar() {
  const pathname = usePathname();
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
    <>
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300",
        scrolled || open
          ? "border-line/60 bg-paper/85 backdrop-blur-md"
          : "border-transparent bg-transparent",
      )}
    >
      <div className="landing-container flex h-16 items-center justify-between md:h-[72px]">
        <Link href="/" className="shrink-0" aria-label="DEPANNI.ma, accueil">
          <span className="font-display text-[22px] font-bold tracking-tight text-ink md:text-[26px]">
            DEPANNI
          </span>
          <span className="font-sans text-[15px] font-medium text-rust-deep">.ma</span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Navigation principale">
          {NAV_LINKS.map((link) => {
            const active = link.match(pathname);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "underline-grow text-sm font-medium tracking-[-0.01em] text-ink/75",
                  active && "text-ink",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="#cta"
            data-event="nav-download"
            className="underline-grow text-sm font-medium text-ink/70"
          >
            Télécharger l&apos;app
          </Link>
          <RequestCta event="nav-request" className="min-h-[44px] px-5 text-sm">
            Demander un artisan
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </RequestCta>
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full text-ink lg:hidden"
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? (
            <X className="h-6 w-6" strokeWidth={1.5} aria-hidden />
          ) : (
            <Menu className="h-6 w-6" strokeWidth={1.5} aria-hidden />
          )}
        </button>
      </div>

    </header>
      {open && (
        <div className="fixed inset-x-0 bottom-0 top-16 z-[60] bg-paper lg:hidden">
          <nav className="landing-container flex h-[calc(100dvh-4rem)] flex-col justify-center gap-2">
            {NAV_LINKS.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <Link
                  href={link.href}
                  className="block py-3 font-display text-display-3 text-ink"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28 }}
              className="mt-6 flex flex-col gap-3"
            >
              <RequestCta event="nav-request-mobile" onClick={() => setOpen(false)}>
                Demander un artisan
              </RequestCta>
              <LandingButton href="#cta" variant="ghost" event="nav-download-mobile" onClick={() => setOpen(false)}>
                Télécharger l&apos;app
              </LandingButton>
            </motion.div>
          </nav>
        </div>
      )}
    </>
  );
}
