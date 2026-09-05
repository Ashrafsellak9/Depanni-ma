import type { Metadata } from "next";
import { Suspense } from "react";

import { PublicPageShell } from "@/components/landing/PublicPageShell";
import { TarifsPage } from "@/components/pricing/TarifsPage";
import { TARIFS_FAQ } from "@/components/pricing/tarifsData";

export const metadata: Metadata = {
  title: "Tarifs",
  description:
    "Les clients ne paient jamais DEPANNI.ma. Les artisans choisissent Standard (15 %), Premium (199 MAD/mois) ou Pro, sans engagement, à El Jadida.",
  openGraph: {
    title: "Tarifs transparents | DEPANNI.ma",
    description:
      "Gratuit pour les clients. Trois formules artisans : Standard, Premium, Pro. Commission claire, sans frais cachés.",
  },
};

export default function TarifsRoutePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: TARIFS_FAQ.map((item) => ({
      "@type": "Question",
      name: item.question.replace(/\u00a0/g, " "),
      acceptedAnswer: {
        "@type": "Answer",
        text: `${item.lead ?? ""} ${item.body}`.trim(),
      },
    })),
  };

  return (
    <PublicPageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Suspense>
        <TarifsPage />
      </Suspense>
    </PublicPageShell>
  );
}
