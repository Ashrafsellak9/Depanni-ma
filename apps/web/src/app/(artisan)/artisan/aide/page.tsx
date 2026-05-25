"use client";

import { HelpCircle, MessageCircle, Phone } from "lucide-react";

const FAQ = [
  {
    q: "Comment accepter une mission ?",
    a: "Consultez l'onglet Missions → En attente, puis cliquez sur « Proposer mon prix » avant la fin du compte à rebours.",
  },
  {
    q: "Quand suis-je payé ?",
    a: "Le solde net est crédité après validation client. Les virements bancaires sont traités sous 24h ouvrées.",
  },
  {
    q: "Comment modifier ma disponibilité ?",
    a: "Utilisez le bouton « Disponible / En pause » en haut à droite du tableau de bord.",
  },
];

export default function ArtisanAidePage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <button
          type="button"
          className="flex items-center gap-3 rounded-2xl border border-dep-border bg-white p-5 text-left hover:bg-cream"
        >
          <MessageCircle className="text-orange" />
          <div>
            <div className="font-semibold text-navy">Chat support</div>
            <div className="text-[12px] text-dep-gray">Réponse &lt; 2h</div>
          </div>
        </button>
        <button
          type="button"
          className="flex items-center gap-3 rounded-2xl border border-dep-border bg-white p-5 text-left hover:bg-cream"
        >
          <Phone className="text-green" />
          <div>
            <div className="font-semibold text-navy">05 22 XX XX XX</div>
            <div className="text-[12px] text-dep-gray">Lun–Sam 8h–20h</div>
          </div>
        </button>
      </div>

      <div className="rounded-2xl border border-dep-border bg-white p-6">
        <div className="mb-4 flex items-center gap-2">
          <HelpCircle className="text-navy" size={20} />
          <h2 className="font-syne text-lg font-bold text-navy">Questions fréquentes</h2>
        </div>
        <div className="space-y-4">
          {FAQ.map((item) => (
            <div key={item.q} className="border-b border-dep-border/50 pb-4 last:border-0">
              <div className="text-[14px] font-semibold text-navy">{item.q}</div>
              <p className="mt-1 text-[13px] leading-relaxed text-dep-gray">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
