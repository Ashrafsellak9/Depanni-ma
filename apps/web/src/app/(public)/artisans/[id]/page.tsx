import Link from "next/link";
import { notFound } from "next/navigation";

import { FEATURED_ARTISANS } from "@/lib/featured-artisans";

// TODO: implémenter la page profil artisan complète.

type PageProps = {
  params: { id: string };
};

export default function ArtisanProfileStubPage({ params }: PageProps) {
  const artisan = FEATURED_ARTISANS.find((item) => item.id === params.id);
  if (!artisan) notFound();

  return (
    <main className="landing-container py-24 md:py-32">
      <p className="font-mono text-xs uppercase tracking-widest text-ink/65">Profil artisan</p>
      <h1 className="mt-3 font-display text-3xl font-semibold text-ink">
        {artisan.firstName} {artisan.lastInitial}
      </h1>
      <p className="mt-2 text-ink/60">
        {artisan.trade} · {artisan.neighborhood}
      </p>
      <p className="mt-6 text-lg text-ink/70">Page en cours de construction</p>
      <Link href="/#visages" className="mt-8 inline-flex text-sm font-medium text-rust-deep">
        Retour aux visages de DEPANNI
      </Link>
    </main>
  );
}
