import type { Metadata } from "next";

import { AuthCard } from "@/components/auth/AuthCard";
import { ForgotPasswordForm } from "@/components/forms/ForgotPasswordForm";
import { DisplayTitle } from "@/components/ui/display-title";

export const metadata: Metadata = {
  title: "Mot de passe oublié",
};

export default function ForgotPasswordPage() {
  return (
    <AuthCard>
      <DisplayTitle as="h1" size="display-3" className="text-[1.5rem]">
        Mot de passe oublié
      </DisplayTitle>
      <p className="mt-2 text-sm text-dep-gray">
        Recevez un code par SMS ou email pour choisir un nouveau mot de passe.
      </p>
      <ForgotPasswordForm />
    </AuthCard>
  );
}
