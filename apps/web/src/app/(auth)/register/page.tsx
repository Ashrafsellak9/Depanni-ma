import type { Metadata } from "next";
import Link from "next/link";

import { AccountTypeCard } from "@/components/auth/AccountTypeCard";
import { AuthCard } from "@/components/auth/AuthCard";
import { DisplayTitle } from "@/components/ui/display-title";

export const metadata: Metadata = {
  title: "Inscription",
};

export default function RegisterPage() {
  return (
    <AuthCard>
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-dep-gray">
          Étape 1 sur 3
        </p>
        <div
          className="mt-2 h-1 w-full overflow-hidden rounded-full bg-cream-2"
          role="progressbar"
          aria-valuenow={1}
          aria-valuemin={1}
          aria-valuemax={3}
          aria-label="Progression de l'inscription, étape 1 sur 3"
        >
          <div className="h-full w-1/3 rounded-full bg-orange" />
        </div>
      </div>

      <DisplayTitle as="h1" size="display-3" className="text-[1.5rem]">
        Créer un compte
      </DisplayTitle>
      <p className="mt-2 text-sm text-dep-gray">
        Choisissez votre profil pour commencer, c&apos;est gratuit et sans engagement.
      </p>

      <div className="mt-8 space-y-4">
        <AccountTypeCard
          href="/register/citizen"
          icon="home"
          iconColor="orange"
          title="Je suis citoyen"
          description="J'ai besoin d'un artisan pour un dépannage à domicile"
          ariaLabel="Je suis citoyen : créer un compte client pour demander un dépannage à domicile"
        />
        <AccountTypeCard
          href="/register/artisan"
          icon="hardhat"
          iconColor="navy"
          title="Je suis artisan"
          description="Je veux recevoir des demandes et développer mon activité"
          ariaLabel="Je suis artisan : créer un compte professionnel pour recevoir des demandes de mission"
        />
      </div>

      <p className="mt-6 text-center text-xs text-dep-gray">
        Inscription gratuite · Données protégées · El Jadida
      </p>

      <p className="mt-6 border-t border-dep-border pt-5 text-center text-xs leading-relaxed text-dep-gray">
        En continuant, vous acceptez nos{" "}
        <Link href="/conditions" className="font-medium text-navy underline-offset-2 hover:underline">
          Conditions d&apos;utilisation
        </Link>{" "}
        et notre{" "}
        <Link
          href="/confidentialite"
          className="font-medium text-navy underline-offset-2 hover:underline"
        >
          Politique de confidentialité
        </Link>
        .
      </p>

      <p className="mt-2 text-center text-sm text-dep-gray">
        Déjà inscrit ?{" "}
        <Link
          href="/login"
          className="inline-flex min-h-[44px] items-center font-semibold text-orange hover:underline"
        >
          Se connecter
        </Link>
      </p>

      <p className="mt-4 text-center text-xs text-dep-gray lg:hidden">
        Rejoignez <span className="font-semibold text-navy">+1 200 clients</span> et{" "}
        <span className="font-semibold text-navy">280+ artisans vérifiés</span> à El Jadida.
      </p>
    </AuthCard>
  );
}
