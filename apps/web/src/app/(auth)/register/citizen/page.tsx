import type { Metadata } from "next";
import Link from "next/link";

import { CitizenRegisterForm } from "@/components/forms/CitizenRegisterForm";

export const metadata: Metadata = {
  title: "Inscription citoyen",
};

export default function RegisterCitizenPage() {
  return (
    <>
      <Link
        href="/register"
        className="mb-4 inline-block text-sm text-muted-foreground hover:text-primary"
      >
        ← Retour
      </Link>
      <h1 className="text-2xl font-bold text-navy">Compte citoyen</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Trouvez un artisan de confiance près de chez vous
      </p>
      <div className="mt-8">
        <CitizenRegisterForm />
      </div>
    </>
  );
}
