import type { Metadata } from "next";

import { HowItWorksJsonLd } from "@/components/how-it-works/HowItWorksJsonLd";
import { HowItWorksPage } from "@/components/how-it-works";
import { PublicPageShell } from "@/components/landing/PublicPageShell";

export const metadata: Metadata = {
  title: "Comment ça marche",
  description:
    "Découvrez comment DEPANNI.ma connecte citoyens et artisans vérifiés à El Jadida : demande en moins de 2 min, première offre en moins de 8 min, suivi GPS et paiement sécurisé CMI · Visa · Mastercard.",
  openGraph: {
    title: "Comment ça marche | DEPANNI.ma",
    description:
      "Parcours citoyen et artisan expliqués en 4 étapes. Artisans vérifiés, note 4,8/5, disponible à El Jadida.",
  },
};

export default function CommentCaMarchePage() {
  return (
    <PublicPageShell>
      <HowItWorksJsonLd />
      <HowItWorksPage />
    </PublicPageShell>
  );
}
