import { Suspense } from "react";

import { RequestWizard } from "@/app/(citizen)/request/new/components/RequestWizard";
import { DisplayTitle } from "@/components/ui/display-title";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata = { title: "Nouvelle demande" };

export default function NewRequestPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <DisplayTitle as="h1" size="sm" className="text-2xl">
        Nouvelle demande
      </DisplayTitle>
      <p className="mt-2 text-muted-foreground">
        Décrivez votre besoin en quelques étapes — les artisans proches seront notifiés.
      </p>
      <div className="mt-8">
        <Suspense fallback={<Skeleton className="h-96 w-full rounded-xl" />}>
          <RequestWizard />
        </Suspense>
      </div>
    </div>
  );
}
