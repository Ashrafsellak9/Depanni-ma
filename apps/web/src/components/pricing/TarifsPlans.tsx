import {
  Car,
  Check,
  Key,
  Paintbrush,
  Plus,
  Refrigerator,
  Sparkles,
  Wrench,
  X,
  Zap,
} from "lucide-react";

import { CheckMark } from "@/components/landing/ui/CheckMark";
import { LandingButton } from "@/components/landing/ui/LandingButton";
import { RequestCta } from "@/components/landing/ui/RequestCta";
import { CLIENT_PERKS } from "@/components/pricing/tarifsData";
import { DisplayTitle } from "@/components/ui/display-title";
import { AUTH_ROUTES } from "@/lib/auth";
import { cn } from "@/lib/utils";

const CLIENT_SERVICES = [
  { icon: Wrench, label: "Plomberie" },
  { icon: Zap, label: "Électricité" },
  { icon: Key, label: "Serrurerie" },
  { icon: Car, label: "Mécanique auto" },
  { icon: Paintbrush, label: "Peinture" },
  { icon: Sparkles, label: "Ménage" },
  { icon: Refrigerator, label: "Électroménager" },
  { icon: Plus, label: "Et bien plus…" },
] as const;

const WITHOUT_DEPANNI = [
  "Chercher un contact dans son carnet",
  "Négocier le prix au téléphone",
  "Attendre sans visibilité",
  "Payer en espèces, sans facture",
  "Aucun recours en cas de problème",
] as const;

const WITH_DEPANNI = [
  "3 offres d'artisans vérifiés en < 8 min",
  "Prix fixé avant intervention",
  "Suivi GPS en temps réel",
  "Paiement sécurisé, reçu automatique",
  "Réintervention garantie si besoin",
] as const;

const STANDARD_FEATURES = [
  "Profil artisan vérifié",
  "Accès aux demandes de votre zone",
  "Paiement sécurisé sous 7 jours",
  "Support par email",
  "Statistiques de base",
];

const PREMIUM_FEATURES = [
  "Tout Standard, plus :",
  "Priorité sur les nouvelles demandes (+30 sec avant)",
  "Badge « Artisan Premium » sur le profil",
  "Paiement sécurisé sous 48\u00a0h",
  "Support prioritaire WhatsApp",
  "Statistiques avancées + analyses",
  "Photos avant/après illimitées",
  "Formation continue offerte",
];

const PRO_FEATURES = [
  "Tout Premium, plus :",
  "Commission dégressive jusqu'à 7\u00a0%",
  "Compte manager dédié",
  "Multi-artisans (gestion d'équipe)",
  "API et intégrations sur mesure",
  "Facturation entreprise",
];

function FeatureList({
  items,
  mutedFirst,
}: {
  items: string[];
  mutedFirst?: boolean;
}) {
  return (
    <ul className="mt-6 flex-1 space-y-3">
      {items.map((item, i) => (
        <li key={item} className="flex items-start gap-2.5">
          <CheckMark className="mt-0.5 h-4 w-4 shrink-0 text-rust" />
          <span
            className={cn(
              "text-sm leading-relaxed",
              mutedFirst && i === 0 ? "font-medium opacity-70" : "",
            )}
          >
            {item}
          </span>
        </li>
      ))}
    </ul>
  );
}

export function TarifsClientView() {
  return (
    <>
      <div className="mx-auto max-w-3xl rounded-3xl bg-paper-2 p-10 text-center md:p-16">
        <p className="num font-mono text-[clamp(4.5rem,12vw,7.5rem)] leading-none tracking-[-0.04em] text-rust">
          0&nbsp;MAD
        </p>
        <DisplayTitle as="h2" size="display-3" className="mt-4">
          C&apos;est tout. Toujours.
        </DisplayTitle>
        <ul className="mx-auto mt-10 max-w-md space-y-3.5 text-left">
          {CLIENT_PERKS.map((perk) => (
            <li key={perk} className="flex items-start gap-3">
              <CheckMark className="mt-0.5 h-5 w-5 shrink-0 text-rust" />
              <span className="font-sans text-base text-ink">{perk}</span>
            </li>
          ))}
        </ul>
        <RequestCta event="tarifs-client-request" className="mt-10 min-h-[52px] px-8">
          Faire une demande
        </RequestCta>
      </div>

      <div className="mx-auto mt-16 max-w-4xl">
        <div className="mb-8 text-center">
          <p className="mb-3 font-mono text-xs uppercase tracking-widest text-ink/50">
            Couvert par DEPANNI
          </p>
          <h3 className="font-display text-2xl font-semibold text-ink md:text-3xl">
            Tous les services, sans limite.
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {CLIENT_SERVICES.map((s) => (
            <div
              key={s.label}
              className="flex items-center gap-3 rounded-2xl border border-line bg-white p-4"
            >
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-rust/10">
                <s.icon className="size-4 text-rust" strokeWidth={1.75} aria-hidden />
              </div>
              <span className="text-sm font-medium text-ink">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-3xl">
        <div className="mb-8 text-center">
          <p className="mb-3 font-mono text-xs uppercase tracking-widest text-ink/50">
            Pourquoi DEPANNI
          </p>
          <h3 className="font-display text-2xl font-semibold text-ink md:text-3xl">
            La différence qui change tout.
          </h3>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-line bg-paper-2 p-6">
            <p className="mb-4 text-xs uppercase tracking-widest text-ink/50">Sans DEPANNI</p>
            <ul className="space-y-3">
              {WITHOUT_DEPANNI.map((t) => (
                <li key={t} className="flex items-start gap-3 text-sm text-ink/60">
                  <X className="mt-0.5 size-4 shrink-0 text-ink/30" strokeWidth={2} aria-hidden />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-ink bg-ink p-6 text-white">
            <p className="mb-4 text-xs uppercase tracking-widest text-rust">Avec DEPANNI</p>
            <ul className="space-y-3">
              {WITH_DEPANNI.map((t) => (
                <li key={t} className="flex items-start gap-3 text-sm text-white/90">
                  <Check className="mt-0.5 size-4 shrink-0 text-rust" strokeWidth={2.5} aria-hidden />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export function TarifsArtisanPlans() {
  return (
    <div className="grid items-stretch gap-5 lg:grid-cols-4">
      <article className="flex flex-col rounded-3xl border border-line bg-paper p-8 lg:col-span-1">
        <DisplayTitle as="h3" size="sm" className="text-2xl font-semibold">
          Standard
        </DisplayTitle>
        <p className="mt-2 font-sans text-sm text-ink/70">Pour débuter et tester la plateforme</p>
        <div className="mt-6 border-t border-line pt-6">
          <p>
            <span className="num font-mono text-5xl text-rust">15%</span>
            <span className="ml-1 text-sm text-ink/60">/ mission</span>
          </p>
          <p className="mt-2 font-sans text-xs uppercase tracking-widest text-ink/50">
            Aucun frais fixe
          </p>
        </div>
        <FeatureList items={STANDARD_FEATURES} />
        <LandingButton
          href={AUTH_ROUTES.artisanRegister}
          variant="ghost"
          event="tarifs-standard"
          className="mt-8 w-full border-ink"
        >
          Commencer gratuitement
        </LandingButton>
      </article>

      <article className="relative flex flex-col rounded-3xl border border-ink bg-ink p-8 text-white shadow-xl lg:col-span-2 lg:-mt-6 lg:mb-[-24px] lg:min-h-[calc(100%+24px)]">
        <span className="absolute -top-3 right-6 rounded-full bg-rust px-3 py-1.5 font-sans text-xs uppercase tracking-widest text-white">
          Le plus populaire
        </span>
        <DisplayTitle as="h3" size="sm" className="text-2xl font-semibold text-white">
          Premium
        </DisplayTitle>
        <p className="mt-2 font-sans text-sm text-white/70">
          Pour les artisans qui vivent de leur activité
        </p>
        <div className="mt-6 border-t border-white/10 pt-6">
          <p className="flex flex-wrap items-end gap-1">
            <span className="num font-mono text-6xl text-rust">199</span>
            <span className="num font-mono text-2xl text-white/60">MAD</span>
            <span className="mb-1 text-sm text-white/60">/ mois</span>
          </p>
          <p className="mt-2 font-sans text-xs uppercase tracking-widest text-rust">
            + 10&nbsp;% par mission
          </p>
        </div>
        <FeatureList items={PREMIUM_FEATURES} mutedFirst />
        <LandingButton href={AUTH_ROUTES.artisanRegister} event="tarifs-premium" className="mt-8 w-full">
          Passer Premium
        </LandingButton>
      </article>

      <article className="flex flex-col rounded-3xl border border-line bg-paper-2 p-8 lg:col-span-1">
        <DisplayTitle as="h3" size="sm" className="text-2xl font-semibold">
          Pro
        </DisplayTitle>
        <p className="mt-2 font-sans text-sm text-ink/70">
          Pour les équipes et les artisans à haut volume
        </p>
        <div className="mt-6 border-t border-line pt-6">
          <p>
            <span className="num font-mono text-4xl text-rust">Sur devis</span>
          </p>
          <p className="mt-2 font-sans text-xs uppercase tracking-widest text-ink/50">
            À partir de 20 missions/mois
          </p>
        </div>
        <FeatureList items={PRO_FEATURES} mutedFirst />
        <LandingButton href="/contact" variant="ghost" event="tarifs-pro" className="mt-8 w-full">
          Nous contacter
        </LandingButton>
      </article>
    </div>
  );
}
