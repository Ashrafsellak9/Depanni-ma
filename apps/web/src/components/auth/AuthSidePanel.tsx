"use client";

import {
  BadgeCheck,
  Clock,
  MapPin,
  ShieldCheck,
  TrendingUp,
  Zap,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Accent, DisplayTitle } from "@/components/ui/display-title";

type PanelConfig = {
  headline: React.ReactNode;
  benefits: { icon: LucideIcon; label: string }[];
  socialProof: React.ReactNode;
};

const CITIZEN_PANEL: PanelConfig = {
  headline: (
    <>
      L&apos;artisan qu&apos;il vous <Accent>faut</Accent>,
      <br />
      en quelques minutes
    </>
  ),
  benefits: [
    { icon: BadgeCheck, label: "Artisans vérifiés KYC" },
    { icon: Zap, label: "Première offre en moins de 8 min" },
    { icon: ShieldCheck, label: "Paiement sécurisé après validation" },
  ],
  socialProof: (
    <>
      Rejoignez <span className="font-semibold text-white">+1 200 clients</span> et{" "}
      <span className="font-semibold text-white">280+ artisans vérifiés</span> à El Jadida.
    </>
  ),
};

const ARTISAN_PANEL: PanelConfig = {
  headline: (
    <>
      Développez votre activité
      <br />
      à El <Accent>Jadida</Accent>
    </>
  ),
  benefits: [
    { icon: MapPin, label: "Missions qualifiées près de chez vous" },
    { icon: TrendingUp, label: "Revenus moyens de +3 200 MAD / mois" },
    { icon: ShieldCheck, label: "Paiements sécurisés chaque semaine" },
    { icon: Clock, label: "Inscription gratuite en 5 minutes" },
  ],
  socialProof: (
    <>
      Rejoignez <span className="font-semibold text-white">280+ artisans vérifiés</span> à El
      Jadida.
    </>
  ),
};

function isArtisanContext(pathname: string): boolean {
  return (
    pathname.includes("/register/artisan") ||
    pathname.startsWith("/artisan/register") ||
    pathname.startsWith("/artisan/login")
  );
}

export function AuthSidePanel() {
  const pathname = usePathname();
  const panel = isArtisanContext(pathname) ? ARTISAN_PANEL : CITIZEN_PANEL;

  return (
    <aside className="relative hidden w-[45%] flex-col justify-between overflow-hidden bg-navy p-10 lg:flex xl:p-14">
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-orange/10" />
      <div className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-orange/[0.07]" />

      <Link
        href="/"
        className="relative font-display text-2xl font-extrabold text-white"
        aria-label="DEPANNI.ma, retour à la page d'accueil"
      >
        DEPANNI<span className="text-orange">.ma</span>
      </Link>

      <div className="relative">
        <DisplayTitle as="h2" size="display-2" className="text-white">
          {panel.headline}
        </DisplayTitle>
        <ul className="mt-8 space-y-4">
          {panel.benefits.map((b) => (
            <li key={b.label} className="flex items-center gap-3 text-white/85">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-orange">
                <b.icon className="h-5 w-5" aria-hidden />
              </span>
              <span className="text-sm font-medium">{b.label}</span>
            </li>
          ))}
        </ul>
      </div>

      <p className="relative text-sm text-white/55">{panel.socialProof}</p>
    </aside>
  );
}
