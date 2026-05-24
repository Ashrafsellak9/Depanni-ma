import type { Metadata } from "next";
import { Suspense } from "react";

import { VerifyOtpForm } from "@/components/forms/VerifyOtpForm";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Vérification SMS",
};

export default function RegisterVerifyPage() {
  return (
    <>
      <h1 className="text-2xl font-bold text-navy">Vérification SMS</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Entrez le code reçu par SMS pour activer votre compte
      </p>
      <div className="mt-8">
        <Suspense fallback={<Skeleton className="h-40 w-full" />}>
          <VerifyOtpForm />
        </Suspense>
      </div>
    </>
  );
}
