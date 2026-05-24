import type { Metadata } from "next";
import Link from "next/link";

import { ArtisanRegisterForm } from "@/components/forms/ArtisanRegisterForm";

export const metadata: Metadata = {
  title: "Inscription artisan",
};

export default function RegisterArtisanPage() {
  return (
    <>
      <Link
        href="/register"
        className="mb-4 inline-block text-sm text-muted-foreground hover:text-primary"
      >
        ← Retour
      </Link>
      <h1 className="text-2xl font-bold text-navy">Compte artisan</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Proposez vos services et développez votre activité
      </p>
      <div className="mt-8">
        <ArtisanRegisterForm />
      </div>
    </>
  );
}
