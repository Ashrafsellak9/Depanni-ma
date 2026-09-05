import type { Metadata } from "next";
import Link from "next/link";

import { PublicPageShell } from "@/components/landing/PublicPageShell";
import { DisplayTitle } from "@/components/ui/display-title";

export const metadata: Metadata = {
  title: "Paiement échoué",
};

export default function PaymentFailPage() {
  return (
    <PublicPageShell>
      <div className="container mx-auto max-w-lg px-4 py-20 text-center">
        <DisplayTitle as="h1" size="display-2">
          Paiement non abouti
        </DisplayTitle>
        <p className="mt-4 text-sm text-dep-gray">
          La banque a refusé la transaction ou la session a expiré. Vous pouvez réessayer ou
          choisir le paiement en espèces.
        </p>
        <Link
          href="/missions"
          className="mt-8 inline-flex min-h-[48px] items-center rounded-xl bg-orange px-6 text-sm font-semibold text-white"
        >
          Retour aux missions
        </Link>
      </div>
    </PublicPageShell>
  );
}
