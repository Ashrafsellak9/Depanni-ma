import type { Metadata } from "next";
import { Suspense } from "react";

import { LoginForm } from "@/components/forms/LoginForm";

export const metadata: Metadata = {
  title: "Connexion",
};

export default function LoginPage() {
  return (
    <>
      <h1 className="text-2xl font-bold text-navy">Connexion</h1>
      <p className="mt-2 text-sm text-muted-foreground">Accédez à votre espace DEPANNI</p>
      <div className="mt-8">
        <Suspense fallback={<p className="text-sm text-muted-foreground">Chargement…</p>}>
          <LoginForm />
        </Suspense>
      </div>
    </>
  );
}
