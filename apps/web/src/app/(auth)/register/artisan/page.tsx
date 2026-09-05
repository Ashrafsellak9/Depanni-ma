import type { Metadata } from "next";
import Link from "next/link";

import { AuthCard } from "@/components/auth/AuthCard";
import { ArtisanRegisterForm } from "@/components/forms/ArtisanRegisterForm";
import { DisplayTitle } from "@/components/ui/display-title";

export const metadata: Metadata = {
  title: "Inscription artisan",
};

export default function RegisterArtisanPage() {
  return (
    <AuthCard>
      <Link
        href="/register"
        className="mb-4 inline-flex min-h-[44px] items-center text-sm font-medium text-dep-gray transition-colors duration-200 hover:text-navy"
      >
        ← Retour
      </Link>
      <DisplayTitle as="h1" size="display-3" className="text-[1.5rem]">
        Compte artisan
      </DisplayTitle>
      <p className="mt-2 text-sm text-dep-gray">
        Proposez vos services et développez votre activité
      </p>
      <ArtisanRegisterForm />
    </AuthCard>
  );
}
