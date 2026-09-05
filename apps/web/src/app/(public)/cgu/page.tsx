import type { Metadata } from "next";

import { LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Conditions générales",
  description: "Conditions générales d'utilisation DEPANNI.ma",
};

export default function CguPage() {
  return (
    <LegalPage title="Conditions générales d'utilisation">
      <p>
        DEPANNI.ma met en relation des citoyens et des artisans. La plateforme n&apos;est pas
        partie au contrat de prestation, sauf pour l&apos;encaissement et la commission.
      </p>
      <p>
        <strong>Citoyens :</strong> publication gratuite des demandes, paiement du montant convenu
        (carte CMI, espèces). Une commission est prélevée sur le montant artisan.
      </p>
      <p>
        <strong>Artisans :</strong> compte soumis à vérification KYC. L&apos;accès aux missions
        peut être suspendu en cas de litige, note insuffisante ou documents invalides.
      </p>
      <p>
        Les litiges sont traités par l&apos;équipe DEPANNI. Un remboursement partiel ou total peut
        être décidé après médiation.
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
