import type { Metadata } from "next";
import { Suspense } from "react";

import { AuthCard } from "@/components/auth/AuthCard";
import { VerifyOtpForm } from "@/components/forms/VerifyOtpForm";
import { DisplayTitle } from "@/components/ui/display-title";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Vérification SMS",
};

export default function RegisterVerifyPage() {
  return (
    <AuthCard>
      <DisplayTitle as="h1" size="display-3" className="text-[1.5rem]">
        Vérification SMS
      </DisplayTitle>
      <p className="mt-2 text-sm text-muted-foreground">
        Entrez le code reçu par SMS pour activer votre compte
      </p>
      <div className="mt-8">
        <Suspense fallback={<Skeleton className="h-40 w-full" />}>
          <VerifyOtpForm />
        </Suspense>
      </div>
    </AuthCard>
  );
}
