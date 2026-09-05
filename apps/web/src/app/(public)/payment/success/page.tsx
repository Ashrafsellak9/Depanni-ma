import type { Metadata } from "next";
import Link from "next/link";

import { PublicPageShell } from "@/components/landing/PublicPageShell";
import { DisplayTitle } from "@/components/ui/display-title";

export const metadata: Metadata = {
  title: "Paiement confirmé",
};

export default function PaymentSuccessPage() {
  return (
    <PublicPageShell>
      <div className="container mx-auto max-w-lg px-4 py-20 text-center">
        <DisplayTitle as="h1" size="display-2">
          Paiement confirmé
        </DisplayTitle>
        <p className="mt-4 text-sm text-dep-gray">
          Votre paiement carte a été accepté. L&apos;artisan peut intervenir ; les fonds sont
          sécurisés jusqu&apos;à la fin de mission.
        </p>
        <Link
          href="/missions"
          className="mt-8 inline-flex min-h-[48px] items-center rounded-xl bg-orange px-6 text-sm font-semibold text-white"
        >
          Voir mes missions
        </Link>
      </div>
    </PublicPageShell>
  );
}
