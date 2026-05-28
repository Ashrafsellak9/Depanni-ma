"use client";

import { ArrowRight, Mail, MessageCircle, Phone } from "lucide-react";

const CONTACT_CARDS = [
  {
    icon: MessageCircle,
    title: "Chat support",
    desc: "Réponse en moins de 2h",
    action: "Démarrer le chat",
    badge: "En ligne",
    badgeColor: "green" as const,
    href: "#chat",
  },
  {
    icon: Phone,
    title: "Téléphone",
    desc: "Lun–Sam 8h–20h",
    action: "05 22 XX XX XX",
    badge: "Gratuit",
    badgeColor: "navy" as const,
    href: "tel:0522000000",
  },
  {
    icon: Mail,
    title: "Email",
    desc: "Réponse sous 24h",
    action: "support@depanni.ma",
    badge: "Toujours dispo",
    badgeColor: "orange" as const,
    href: "mailto:support@depanni.ma",
  },
];

export function HelpContactCards() {
  return (
    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
      {CONTACT_CARDS.map((c) => {
        const Icon = c.icon;
        return (
          <a
            key={c.title}
            href={c.href}
            className="group block rounded-2xl border border-[#E5E0D8] bg-white p-5 transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="mb-3 flex items-start justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[rgba(240,90,26,0.1)] transition-colors group-hover:bg-[rgba(240,90,26,0.15)]">
                <Icon size={18} className="text-[#F05A1A]" />
              </div>
              <span
                className={`rounded-full px-2 py-1 text-[10px] font-semibold ${
                  c.badgeColor === "green"
                    ? "bg-[rgba(27,138,78,0.1)] text-[#1B8A4E]"
                    : c.badgeColor === "navy"
                      ? "bg-[rgba(15,30,53,0.07)] text-[#0F1E35]"
                      : "bg-[rgba(240,90,26,0.1)] text-[#F05A1A]"
                }`}
              >
                {c.badge}
              </span>
            </div>
            <div className="mb-0.5 text-[14px] font-semibold text-[#0F1E35]">{c.title}</div>
            <div className="mb-3 text-[12px] text-[#6B7280]">{c.desc}</div>
            <div className="flex items-center gap-1 text-[12px] font-semibold text-[#F05A1A] transition-all group-hover:gap-2">
              {c.action} <ArrowRight size={12} />
            </div>
          </a>
        );
      })}
    </div>
  );
}
