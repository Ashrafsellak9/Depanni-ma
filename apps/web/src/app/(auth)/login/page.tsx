import { Lock } from "lucide-react";
import type { Metadata } from "next";
import { Suspense } from "react";

import { AuthCard } from "@/components/auth/AuthCard";
import { LoginForm } from "@/components/forms/LoginForm";
import { DisplayTitle } from "@/components/ui/display-title";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Connexion",
};

export default function LoginPage() {
  return (
    <>
      <AuthCard>
        <DisplayTitle as="h1" size="display-3" className="text-[1.5rem]">
          Connexion
        </DisplayTitle>
        <p className="mt-2 text-sm text-dep-gray">Accédez à votre espace DEPANNI</p>
        <Suspense
          fallback={
            <div className="mt-8 space-y-4">
              <Skeleton className="h-12 w-full rounded-xl" />
              <Skeleton className="h-12 w-full rounded-xl" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
          }
        >
          <LoginForm />
        </Suspense>
      </AuthCard>

      <p className="flex items-center justify-center gap-1.5 text-center text-xs text-dep-gray">
        <Lock className="h-3.5 w-3.5 shrink-0 text-dep-gray" aria-hidden />
        Connexion sécurisée · Vos données sont protégées
      </p>
    </>
  );
}
