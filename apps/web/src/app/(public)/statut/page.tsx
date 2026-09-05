import type { Metadata } from "next";

import { LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Statut du service",
  description: "État opérationnel de la plateforme DEPANNI.ma",
  robots: { index: false, follow: false },
};

export default function StatutPage() {
  return (
    <LegalPage title="Statut du service">
      <p>Tous les systèmes sont opérationnels.</p>
      <p>
        Cette page affichera bientôt l&apos;état en temps réel des services DEPANNI (app, paiements,
        notifications). En cas d&apos;incident, contactez-nous à{" "}
        <a href="mailto:contact@depanni.ma" className="underline">
          contact@depanni.ma
        </a>
        .
      </p>
    </LegalPage>
  );
}
