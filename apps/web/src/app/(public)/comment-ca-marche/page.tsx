import type { Metadata } from "next";

import { HowItWorksPage } from "@/components/how-it-works";
import { PublicPageShell } from "@/components/landing/PublicPageShell";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Comment ça marche",
  description:
    "Découvrez comment DEPANNI.ma connecte citoyens et artisans vérifiés à El Jadida — demande, offres, suivi GPS et paiement sécurisé.",
};

export default function CommentCaMarchePage() {
  return (
    <PublicPageShell>
      <HowItWorksPage />
    </PublicPageShell>
  );
}
