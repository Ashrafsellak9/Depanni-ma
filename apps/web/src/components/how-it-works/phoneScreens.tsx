import {
  Camera,
  Check,
  ChevronLeft,
  Droplets,
  KeyRound,
  MessageCircle,
  Paintbrush,
  Phone,
  Sparkles,
  Upload,
  Wrench,
  Zap,
} from "lucide-react";
import type { ReactNode } from "react";

import { InitialAvatar } from "@/components/landing/ui/InitialAvatar";
import { MockCard, MockStars, PhoneStatusBar } from "@/components/ui/phone-screen";
import { cn } from "@/lib/utils";

function ScreenShell({
  header,
  children,
  footer,
}: {
  header: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="flex h-full flex-col bg-paper px-3.5 pb-4 pt-11">
      <PhoneStatusBar />
      <div className="mt-2.5 shrink-0">{header}</div>
      <div className="min-h-0 flex-1 overflow-hidden pt-3">{children}</div>
      {footer}
    </div>
  );
}

function BackHeader({ title, trailing }: { title: string; trailing?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-1.5">
      <ChevronLeft className="h-4 w-4 shrink-0 text-ink" strokeWidth={1.5} aria-hidden />
      <span className="flex-1 font-sans text-[14px] font-medium text-ink">{title}</span>
      {trailing}
    </div>
  );
}

const CATEGORIES = [
  { label: "Plomb", Icon: Droplets, active: true },
  { label: "Élec", Icon: Zap, active: false },
  { label: "Serru", Icon: KeyRound, active: false },
  { label: "Méca", Icon: Wrench, active: false },
  { label: "Peint", Icon: Paintbrush, active: false },
  { label: "Ménage", Icon: Sparkles, active: false },
] as const;

export function ClientRequestScreen() {
  return (
    <ScreenShell header={<BackHeader title="Nouvelle demande" />}>
      <p className="font-display text-[18px] font-semibold leading-tight text-ink">
        De quoi avez-vous
        <br />
        besoin&nbsp;?
      </p>
      <div className="mt-3 grid grid-cols-3 gap-1.5">
        {CATEGORIES.map((cat) => (
          <div
            key={cat.label}
            className={cn(
              "flex aspect-square flex-col items-center justify-center gap-1 rounded-2xl",
              cat.active ? "bg-rust text-white" : "border border-line bg-white text-ink",
            )}
          >
            <cat.Icon className="h-4 w-4" strokeWidth={1.5} aria-hidden />
            <span className="font-sans text-[9px] font-medium">{cat.label}</span>
          </div>
        ))}
      </div>
      <MockCard className="mt-2.5" ring>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-sans text-[11px] font-medium text-ink">
            <Droplets className="h-3.5 w-3.5 text-rust" strokeWidth={1.5} aria-hidden />
            Plomberie
          </span>
          <Check className="h-3.5 w-3.5 text-rust" strokeWidth={2} aria-hidden />
        </div>
      </MockCard>
      <div className="mt-2.5 min-h-[64px] rounded-2xl border border-line bg-white px-3 py-2.5">
        <p className="font-sans text-[11px] leading-relaxed text-ink/40">
          Décrivez brièvement
          <br />
          (facultatif)
        </p>
      </div>
      <div className="mt-3 flex h-10 items-center justify-center rounded-full bg-rust font-sans text-[13px] font-medium text-white">
        Continuer
      </div>
    </ScreenShell>
  );
}

const OFFERS = [
  { initials: "KK", name: "Karim K.", rating: "4,8", reviews: "127", price: "150", eta: "25 min", ring: true },
  { initials: "HM", name: "Hassan M.", rating: "4,9", reviews: "203", price: "180", eta: "15 min", ring: false },
  { initials: "YR", name: "Yassine R.", rating: "4,7", reviews: "89", price: "140", eta: "40 min", ring: false },
] as const;

export function ClientOffersScreen() {
  return (
    <ScreenShell
      header={
        <BackHeader
          title="Vos propositions"
          trailing={
            <span className="rounded-full bg-rust px-2 py-0.5 font-sans text-[9px] font-medium text-white">
              3 nouvelles
            </span>
          }
        />
      }
    >
      <div className="space-y-2">
        {OFFERS.map((o) => (
          <MockCard key={o.initials} ring={o.ring}>
            <div className="flex items-start gap-2">
              <InitialAvatar initials={o.initials} className="h-8 w-8 shrink-0 text-[10px]" />
              <div className="min-w-0 flex-1">
                <p className="font-sans text-[12px] font-medium text-ink">{o.name}</p>
                <div className="mt-0.5 flex items-center gap-1">
                  <MockStars filled={5} />
                  <span className="num font-mono text-[9px] text-ink/60">
                    {o.rating} ({o.reviews})
                  </span>
                </div>
                <p className="mt-1 font-sans text-[10px] text-ink/55">Arrive dans {o.eta}</p>
              </div>
              <div className="text-right">
                <p className="num font-mono text-[13px] text-ink">{o.price}&nbsp;MAD</p>
                <span className="mt-1 inline-flex rounded-full border border-ink/15 px-2 py-0.5 font-sans text-[9px] font-medium text-ink">
                  Choisir
                </span>
              </div>
            </div>
          </MockCard>
        ))}
      </div>
    </ScreenShell>
  );
}

function TrackingMap() {
  return (
    <svg viewBox="0 0 280 132" className="h-[118px] w-full" aria-hidden>
      <rect width="280" height="132" rx="16" fill="#EBE3D5" />
      <path d="M0 78h280" stroke="#DDD3C1" strokeWidth="8" />
      <path d="M0 42h280" stroke="#DDD3C1" strokeWidth="5" />
      <path d="M92 0v132" stroke="#DDD3C1" strokeWidth="6" />
      <path d="M188 0v132" stroke="#DDD3C1" strokeWidth="4" />
      <path
        d="M48 96 C 90 96, 110 40, 168 40 S 230 88, 236 88"
        fill="none"
        stroke="#D9451F"
        strokeWidth="2"
        strokeDasharray="5 4"
        strokeLinecap="round"
      />
      <circle cx="48" cy="96" r="7" fill="#0B1B2B" />
      <circle cx="48" cy="96" r="3" fill="#F5EFE6" />
      <circle cx="236" cy="88" r="8" fill="#D9451F" />
      <circle cx="236" cy="88" r="3.2" fill="#F5EFE6" />
    </svg>
  );
}

export function ClientTrackingScreen() {
  return (
    <ScreenShell header={<BackHeader title="Suivi en direct" />}>
      <MockCard className="p-0">
        <TrackingMap />
      </MockCard>
      <MockCard className="mt-2.5">
        <div className="flex items-center gap-2">
          <InitialAvatar initials="KA" className="h-8 w-8 text-[10px]" />
          <div className="flex-1">
            <p className="font-sans text-[12px] font-medium text-ink">Khalid arrive dans 6 min</p>
            <p className="font-sans text-[10px] text-ink/55">À 500 m de chez vous</p>
          </div>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-line">
          <div className="h-full w-[70%] rounded-full bg-rust" />
        </div>
        <div className="mt-3 flex gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-line bg-paper">
            <Phone className="h-3.5 w-3.5 text-rust" strokeWidth={1.5} aria-hidden />
          </span>
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-line bg-paper">
            <MessageCircle className="h-3.5 w-3.5 text-rust" strokeWidth={1.5} aria-hidden />
          </span>
        </div>
      </MockCard>
      <p className="mt-3 text-center font-sans text-[10px] text-ink/50">
        Vous serez notifié à son arrivée
      </p>
    </ScreenShell>
  );
}

export function ClientPaymentScreen() {
  return (
    <ScreenShell header={<BackHeader title="Mission terminée" />}>
      <div className="mb-3 flex justify-center">
        <svg viewBox="0 0 56 56" className="h-12 w-12 text-rust" aria-hidden>
          <circle cx="28" cy="28" r="26" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.25" />
          <path
            d="M16 29.2 24.2 37 40 18"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <MockCard>
        <dl className="space-y-1.5 font-sans text-[11px]">
          <div className="flex justify-between">
            <dt className="text-ink/55">Service</dt>
            <dd className="text-ink">Fuite sous évier</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink/55">Artisan</dt>
            <dd className="text-ink">Khalid A.</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink/55">Durée</dt>
            <dd className="text-ink">45 min</dd>
          </div>
          <div className="flex justify-between border-t border-line pt-1.5">
            <dt className="text-ink/55">Total</dt>
            <dd className="num font-mono text-[13px] text-ink">150 MAD</dd>
          </div>
        </dl>
      </MockCard>
      <p className="mt-3 font-sans text-[11px] font-medium text-ink">Votre note</p>
      <div className="mt-1.5">
        <MockStars filled={3} />
      </div>
      <div className="mt-2.5 min-h-[52px] rounded-2xl border border-line bg-white px-3 py-2">
        <p className="font-sans text-[11px] text-ink/40">Laissez un commentaire (facultatif)</p>
      </div>
      <div className="mt-3 flex h-10 items-center justify-center rounded-full bg-rust font-sans text-[13px] font-medium text-white">
        Payer et valider
      </div>
    </ScreenShell>
  );
}

const SIGNUP_CATS = [
  { label: "Plomberie", on: true },
  { label: "Électricité", on: true },
  { label: "Serrurerie", on: false },
] as const;

export function ArtisanSignupScreen() {
  return (
    <ScreenShell header={<BackHeader title="Inscription" />}>
      <p className="font-display text-[18px] font-semibold leading-tight text-ink">Votre profil</p>
      <label className="mt-3 block">
        <span className="mb-1 block font-sans text-[10px] text-ink/55">Nom</span>
        <div className="rounded-xl border border-line bg-white px-3 py-2 font-sans text-[12px] text-ink">
          Khalid Amrani
        </div>
      </label>
      <p className="mb-1.5 mt-3 font-sans text-[10px] text-ink/55">Catégories</p>
      <div className="space-y-1.5">
        {SIGNUP_CATS.map((c) => (
          <MockCard key={c.label} className="flex items-center justify-between py-2">
            <span className="font-sans text-[12px] text-ink">{c.label}</span>
            <span
              className={cn(
                "flex h-4 w-4 items-center justify-center rounded border",
                c.on ? "border-rust bg-rust text-white" : "border-line bg-white",
              )}
            >
              {c.on ? <Check className="h-3 w-3" strokeWidth={2.4} aria-hidden /> : null}
            </span>
          </MockCard>
        ))}
      </div>
      <MockCard className="mt-2.5 flex items-center gap-2 py-2.5">
        <Upload className="h-4 w-4 text-rust" strokeWidth={1.5} aria-hidden />
        <div>
          <p className="font-sans text-[11px] font-medium text-ink">CIN recto + verso</p>
          <p className="font-sans text-[9px] text-ink/50">cin-khalid.jpg</p>
        </div>
        <Camera className="ml-auto h-3.5 w-3.5 text-ink/40" strokeWidth={1.5} aria-hidden />
      </MockCard>
      <div className="mt-3 flex items-center justify-center gap-1.5 rounded-full bg-success/15 px-3 py-2">
        <Check className="h-3.5 w-3.5 text-success" strokeWidth={2} aria-hidden />
        <span className="font-sans text-[11px] font-medium text-success">Vérifié</span>
      </div>
    </ScreenShell>
  );
}

const ALERTS = [
  { title: "Fuite sous évier", zone: "Hay Salam · 1,2 km", urgent: true },
  { title: "Tableau électrique", zone: "Centre-ville · 2,8 km", urgent: false },
] as const;

export function ArtisanAlertsScreen() {
  return (
    <ScreenShell
      header={
        <BackHeader
          title="Alertes"
          trailing={
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-pulse-soft rounded-full bg-rust" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-rust" />
            </span>
          }
        />
      }
    >
      <div className="space-y-2">
        {ALERTS.map((job) => (
          <MockCard key={job.title} ring={job.urgent}>
            {job.urgent ? (
              <p className="mb-1 font-sans text-[9px] font-semibold uppercase tracking-widest text-rust">
                Urgent · Plomberie
              </p>
            ) : (
              <p className="mb-1 font-sans text-[9px] uppercase tracking-widest text-ink/45">
                Électricité
              </p>
            )}
            <p className="font-sans text-[13px] font-medium text-ink">{job.title}</p>
            <p className="mt-0.5 font-sans text-[10px] text-ink/55">{job.zone}</p>
            <div className="mt-2.5 flex gap-1.5">
              <span className="flex h-8 flex-1 items-center justify-center rounded-full bg-ink font-sans text-[11px] font-medium text-white">
                Accepter
              </span>
              <span className="flex h-8 flex-1 items-center justify-center rounded-full border border-line font-sans text-[11px] text-ink/60">
                Passer
              </span>
            </div>
          </MockCard>
        ))}
      </div>
    </ScreenShell>
  );
}

export function ArtisanPricingScreen() {
  return (
    <ScreenShell header={<BackHeader title="Votre tarif" />}>
      <p className="font-display text-[18px] font-semibold leading-tight text-ink">
        Fixez votre prix
      </p>
      <MockCard className="mt-3">
        <p className="font-sans text-[10px] text-ink/55">Mission</p>
        <p className="font-sans text-[13px] font-medium text-ink">Fuite sous évier</p>
        <p className="mt-0.5 font-sans text-[10px] text-ink/55">Hay Salam · photos jointes</p>
      </MockCard>
      <MockCard className="mt-2" ring>
        <p className="font-sans text-[10px] uppercase tracking-widest text-ink/45">
          Suggestion algo
        </p>
        <p className="num mt-1 font-mono text-[28px] leading-none tracking-[-0.03em] text-rust">
          150 MAD
        </p>
        <p className="mt-1 font-sans text-[10px] text-ink/55">Médiane du quartier, 45 min</p>
      </MockCard>
      <div className="mt-2 grid grid-cols-2 gap-1.5">
        <MockCard className="py-2">
          <p className="font-sans text-[9px] text-ink/45">Votre prix</p>
          <p className="num font-mono text-[14px] text-ink">150 MAD</p>
        </MockCard>
        <MockCard className="py-2">
          <p className="font-sans text-[9px] text-ink/45">Arrivée</p>
          <p className="font-sans text-[13px] font-medium text-ink">12 min</p>
        </MockCard>
      </div>
      <div className="mt-3 flex h-10 items-center justify-center rounded-full bg-rust font-sans text-[13px] font-medium text-white">
        Envoyer l&apos;offre
      </div>
    </ScreenShell>
  );
}

function MiniSparkline() {
  return (
    <svg viewBox="0 0 200 48" className="mt-2 h-10 w-full" aria-hidden>
      <path
        d="M0 36 C 18 34, 28 30, 40 28 S 70 32, 80 22 S 110 8, 130 14 S 160 28, 180 10 L 200 6 V 48 H 0 Z"
        fill="#D9451F"
        fillOpacity="0.12"
      />
      <path
        d="M0 36 C 18 34, 28 30, 40 28 S 70 32, 80 22 S 110 8, 130 14 S 160 28, 180 10 L 200 6"
        fill="none"
        stroke="#D9451F"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

const EARNINGS = [
  { label: "Fuite sous évier", amount: "+150" },
  { label: "Tableau électrique", amount: "+220" },
  { label: "Serrure entrée", amount: "+180" },
] as const;

export function ArtisanEarningsScreen() {
  return (
    <ScreenShell header={<BackHeader title="Revenus" />}>
      <MockCard className="bg-ink p-4 text-white">
        <p className="font-sans text-[10px] text-white/55">Solde disponible</p>
        <p className="num mt-1 font-mono text-[26px] leading-none tracking-[-0.03em]">
          3&nbsp;450&nbsp;MAD
        </p>
        <MiniSparkline />
      </MockCard>
      <p className="mb-1.5 mt-3 font-sans text-[10px] uppercase tracking-widest text-ink/45">
        Dernières missions
      </p>
      <div className="space-y-1.5">
        {EARNINGS.map((row) => (
          <MockCard key={row.label} className="flex items-center justify-between py-2">
            <span className="font-sans text-[11px] text-ink">{row.label}</span>
            <span className="num font-mono text-[12px] text-rust">{row.amount}&nbsp;MAD</span>
          </MockCard>
        ))}
      </div>
    </ScreenShell>
  );
}
