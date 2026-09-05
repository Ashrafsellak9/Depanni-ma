import type { Metadata } from "next";

import { LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Mentions légales de DEPANNI.ma",
};

export default function MentionsLegalesPage() {
  return (
    <LegalPage title="Mentions légales">
      <p>
        DEPANNI.ma est une marketplace de mise en relation entre citoyens et artisans vérifiés à
        El Jadida et au Maroc.
      </p>
      <p>
        <strong>Éditeur :</strong> DEPANNI.ma — El Jadida, Maroc.
        <br />
        <strong>Contact :</strong> contact@depanni.ma
      </p>
      <p>
        L&apos;utilisation du site implique l&apos;acceptation des conditions générales
        d&apos;utilisation. Les données personnelles sont traitées conformément à la loi 09-08.
      </p>
      <p>
        Hébergement : infrastructure cloud (API Express, PostgreSQL, stockage objet). Les paiements
        par carte transitent par CMI Maroc.
      </p>
      <p>
        Cette page est en cours de rédaction. Pour toute question, contactez-nous à{" "}
        <a href="mailto:contact@depanni.ma" className="underline">
          contact@depanni.ma
        </a>
        .
      </p>
    </LegalPage>
  );
}
