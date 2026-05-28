"use client";

import type { ReactNode } from "react";

const PHONE_FRAME = "w-[200px] shrink-0 rounded-[28px] bg-[#0a0f18] p-3 shadow-[0_24px_60px_rgba(15,30,53,0.18)]";

export function StepVisual({ stepId }: { stepId: string; stepNum?: number }) {
  const visuals: Record<string, ReactNode> = {
    step1_phone: (
      <div className={PHONE_FRAME}>
        <div className="min-h-[360px] rounded-[20px] bg-cream p-3">
          <div className="mb-2 text-[8px] font-bold text-navy">De quoi avez-vous besoin ?</div>
          <div className="mb-2 grid grid-cols-3 gap-1.5">
            {["🔧", "⚡", "🔑", "🚗", "🪟", "🎨"].map((emoji, i) => (
              <div
                key={emoji}
                className={`rounded-lg p-2 text-center ${
                  i === 0 ? "bg-navy text-white" : "border border-dep-border bg-white text-navy"
                }`}
              >
                <div className="text-[14px]">{emoji}</div>
                <div className={`mt-0.5 text-[7px] ${i === 0 ? "text-white/90" : ""}`}>
                  {["Plomb.", "Élec.", "Serr.", "Méca.", "Vitr.", "Pein."][i]}
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-1.5 rounded-lg border border-orange/20 bg-orange/[0.08] p-2">
            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange" />
            <div className="text-[7px] text-orange">3 plombiers disponibles à 2 km</div>
          </div>
        </div>
      </div>
    ),
    step2_offers: (
      <div className={PHONE_FRAME}>
        <div className="min-h-[360px] rounded-[20px] bg-cream p-3">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-[8px] font-bold text-navy">Propositions</div>
            <div className="rounded-full bg-orange px-1.5 py-0.5 text-[7px] font-bold text-white">4 offres</div>
          </div>
          {[
            { init: "KA", price: "150", stars: 5, time: "12 min", best: true },
            { init: "YM", price: "120", stars: 4, time: "18 min", best: false },
          ].map((a) => (
            <div
              key={a.init}
              className={`mb-1.5 rounded-xl border bg-white p-2 ${
                a.best ? "border-orange" : "border-dep-border"
              }`}
            >
              {a.best && (
                <div className="mb-1 text-[7px] font-bold text-orange">🏆 Meilleur rapport</div>
              )}
              <div className="flex items-center gap-1.5">
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-navy text-[7px] font-bold text-white">
                  {a.init}
                </div>
                <div className="flex-1">
                  <div className="text-[7px] font-semibold text-navy">Artisan {a.init}</div>
                  <div className="text-[7px] text-orange">{"★".repeat(a.stars)}</div>
                </div>
                <div className="text-right">
                  <div className="text-[9px] font-bold text-navy">{a.price} MAD</div>
                  <div className="text-[7px] text-green">{a.time}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    step3_tracking: (
      <div className={PHONE_FRAME}>
        <div className="min-h-[360px] overflow-hidden rounded-[20px] bg-cream">
          <div className="relative h-[160px] bg-gradient-to-br from-[#d4e8d4] to-[#b0ccb0]">
            <div className="absolute left-1/3 top-1/3 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-orange text-[10px] shadow-lg">
              🏍
            </div>
            <div className="absolute right-1/4 top-1/3 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-navy text-[10px] shadow-lg">
              🏠
            </div>
            <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 shadow-md">
              <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-green" />
              <span className="text-[8px] font-bold text-navy">Khalid · 8 min</span>
            </div>
          </div>
          <div className="p-3">
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange to-orange-2 text-[10px] font-bold text-white">
                KA
              </div>
              <div>
                <div className="text-[8px] font-semibold text-navy">Khalid Amrani</div>
                <div className="text-[7px] text-orange">★★★★★ 4.9</div>
              </div>
              <div className="ml-auto flex gap-1">
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-green/10 text-[10px]">📞</div>
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-navy/[0.06] text-[10px]">💬</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    step4_payment: (
      <div className={PHONE_FRAME}>
        <div className="min-h-[360px] rounded-[20px] bg-cream p-3">
          <div className="mb-3 text-center">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-green/10 text-[20px]">
              ✅
            </div>
            <div className="text-[9px] font-bold text-green">Mission terminée !</div>
          </div>
          <div className="mb-2 rounded-xl border border-dep-border bg-white p-2">
            <div className="mb-1 flex justify-between">
              <span className="text-[7px] text-dep-gray">Fuite robinet</span>
              <span className="text-[8px] font-bold text-navy">150 MAD</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[7px] text-dep-gray">Artisan</span>
              <span className="text-[7px] text-navy">Khalid A.</span>
            </div>
          </div>
          <div className="mb-2 grid grid-cols-3 gap-1">
            {["💳", "📱", "💵"].map((icon, i) => (
              <div
                key={icon}
                className={`rounded-lg border py-1.5 text-center text-[12px] ${
                  i === 0 ? "border-orange bg-orange/[0.06]" : "border-dep-border bg-white"
                }`}
              >
                {icon}
              </div>
            ))}
          </div>
          <div className="rounded-xl bg-navy p-2 text-center">
            <div className="text-[8px] font-bold text-white">Payer 150 MAD →</div>
          </div>
        </div>
      </div>
    ),
    artisan_step1: (
      <div className={PHONE_FRAME}>
        <div className="min-h-[360px] rounded-[20px] bg-cream p-3">
          <div className="mb-2 text-[8px] font-bold text-navy">Inscription artisan</div>
          <div className="mb-2 flex items-center gap-2 rounded-xl border border-dep-border bg-white p-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange to-orange-2 text-[9px] font-bold text-white">
              KA
            </div>
            <div>
              <div className="text-[8px] font-semibold text-navy">Khalid Amrani</div>
              <div className="text-[7px] text-dep-gray">Plombier · El Jadida</div>
            </div>
          </div>
          {["CIN recto ✓", "CIN verso ✓", "Photo profil ✓"].map((doc) => (
            <div
              key={doc}
              className="mb-1.5 flex items-center justify-between rounded-lg border border-green/20 bg-green/[0.06] px-2 py-1.5"
            >
              <span className="text-[7px] text-navy">{doc}</span>
              <span className="text-[7px] font-bold text-green">✓</span>
            </div>
          ))}
          <div className="mt-2 rounded-lg bg-navy/10 px-2 py-1.5 text-center text-[7px] font-semibold text-navy">
            Validation sous 48 h
          </div>
        </div>
      </div>
    ),
    artisan_step2: (
      <div className={PHONE_FRAME}>
        <div className="min-h-[360px] rounded-[20px] bg-cream p-3">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-[8px] font-bold text-navy">Nouvelle mission</div>
            <div className="h-2 w-2 animate-pulse rounded-full bg-orange" />
          </div>
          <div className="mb-2 rounded-xl border-2 border-orange bg-white p-2">
            <div className="mb-1 text-[7px] font-bold text-orange">🚨 Urgent · Plomberie</div>
            <div className="text-[8px] font-semibold text-navy">Fuite sous évier</div>
            <div className="mt-1 text-[7px] text-dep-gray">Hay Hassani · 1.2 km</div>
            <div className="mt-2 flex gap-1">
              <div className="flex-1 rounded-lg bg-navy py-1 text-center text-[7px] font-bold text-white">
                Accepter
              </div>
              <div className="flex-1 rounded-lg border border-dep-border py-1 text-center text-[7px] text-dep-gray">
                Passer
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-dep-border bg-white p-2 opacity-60">
            <div className="text-[7px] text-dep-gray">Électricité · 2.8 km</div>
          </div>
        </div>
      </div>
    ),
    artisan_step3: (
      <div className={PHONE_FRAME}>
        <div className="min-h-[360px] rounded-[20px] bg-cream p-3">
          <div className="mb-2 text-[8px] font-bold text-navy">Votre proposition</div>
          <div className="mb-2 rounded-xl border border-dep-border bg-white p-2">
            <div className="text-[7px] text-dep-gray">Mission</div>
            <div className="text-[8px] font-semibold text-navy">Fuite sous évier</div>
          </div>
          <div className="mb-2 rounded-xl border border-orange bg-orange/[0.06] p-2">
            <div className="text-[7px] text-dep-gray">Votre prix</div>
            <div className="font-syne text-[18px] font-extrabold text-navy">150 MAD</div>
          </div>
          <div className="mb-2 rounded-xl border border-dep-border bg-white p-2">
            <div className="text-[7px] text-dep-gray">Arrivée estimée</div>
            <div className="text-[8px] font-semibold text-green">12 minutes</div>
          </div>
          <div className="rounded-xl bg-orange py-2 text-center text-[8px] font-bold text-white">
            Envoyer l&apos;offre →
          </div>
        </div>
      </div>
    ),
    artisan_step4: (
      <div className={PHONE_FRAME}>
        <div className="min-h-[360px] rounded-[20px] bg-cream p-3">
          <div className="mb-2 text-[8px] font-bold text-navy">Mes revenus</div>
          <div className="mb-2 rounded-xl bg-navy p-2 text-center">
            <div className="text-[7px] text-white/60">Solde disponible</div>
            <div className="font-syne text-[16px] font-extrabold text-white">2 450 MAD</div>
          </div>
          {[
            { label: "Mission #1842", amount: "+150" },
            { label: "Mission #1839", amount: "+200" },
          ].map((tx) => (
            <div
              key={tx.label}
              className="mb-1.5 flex items-center justify-between rounded-lg border border-dep-border bg-white px-2 py-1.5"
            >
              <span className="text-[7px] text-navy">{tx.label}</span>
              <span className="text-[8px] font-bold text-green">{tx.amount} MAD</span>
            </div>
          ))}
          <div className="mt-2 rounded-lg bg-green/10 py-1.5 text-center text-[7px] font-semibold text-green">
            Virement sous 24 h ✓
          </div>
        </div>
      </div>
    ),
  };

  return (
    <div className="flex justify-center">
      {visuals[stepId] ?? (
        <div className={`${PHONE_FRAME} flex min-h-[360px] items-center justify-center`}>
          <span className="text-xs text-dep-gray">Aperçu</span>
        </div>
      )}
    </div>
  );
}
