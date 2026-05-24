import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Inscription",
};

export default function RegisterPage() {
  return (
    <>
      <h1 className="text-2xl font-bold text-navy">Créer un compte</h1>
      <p className="mt-2 text-sm text-muted-foreground">Choisissez votre type de compte</p>
      <div className="mt-8 space-y-4">
        <Button className="w-full" asChild>
          <Link href="/register/citizen">Je suis citoyen — besoin d&apos;un artisan</Link>
        </Button>
        <Button className="w-full" variant="navy" asChild>
          <Link href="/register/artisan">Je suis artisan — proposer mes services</Link>
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          Déjà inscrit ?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </>
  );
}
