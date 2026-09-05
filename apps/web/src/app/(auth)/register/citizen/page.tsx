import type { Metadata } from "next";
import Link from "next/link";

import { AuthCard } from "@/components/auth/AuthCard";
import { RequiredLegend } from "@/components/auth/AuthFormField";
import { CitizenRegisterForm } from "@/components/forms/CitizenRegisterForm";
import { DisplayTitle } from "@/components/ui/display-title";

export const metadata: Metadata = {
  title: "Inscription citoyen",
};

export default function RegisterCitizenPage() {
  return (
    <AuthCard>
      <Link
        href="/register"
        className="mb-4 inline-flex min-h-[44px] items-center text-sm font-medium text-dep-gray transition-colors duration-200 hover:text-navy"
      >
        ← Retour
      </Link>
      <DisplayTitle as="h1" size="display-3" className="text-[1.5rem]">
        Compte citoyen
      </DisplayTitle>
      <p className="mt-2 text-sm text-dep-gray">
        Trouvez un artisan de confiance près de chez vous
      </p>
      <div className="mt-3">
        <RequiredLegend />
      </div>
      <div className="mt-6">
        <CitizenRegisterForm />
      </div>
    </AuthCard>
  );
}
