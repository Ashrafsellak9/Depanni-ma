import type { Metadata } from "next";

import { LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: "Politique de confidentialité DEPANNI.ma",
};

export default function PolitiqueConfidentialitePage() {
  return (
    <LegalPage title="Politique de confidentialité">
      <p>
        Cette page est en cours de rédaction. Pour toute question relative à vos données
        personnelles, contactez-nous à{" "}
        <a href="mailto:contact@depanni.ma" className="underline">
          contact@depanni.ma
        </a>
        .
      </p>
    </LegalPage>
  );
}
