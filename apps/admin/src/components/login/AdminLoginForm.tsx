"use client";

import { ArrowRight, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { AuthErrorBanner } from "@/components/auth/AuthErrorBanner";
import { AuthTextInput } from "@/components/auth/AuthTextInput";
import { PasswordInput } from "@/components/auth/PasswordInput";
import {
  GENERIC_LOGIN_ERROR,
  getFieldErrorMessage,
  getLoginErrorMessage,
} from "@/lib/loginErrors";
import { loginAdmin } from "@/services/adminApi";
import { useAuthStore } from "@/store/authStore";

type LoginFormValues = {
  email: string;
  password: string;
};

export function AdminLoginForm({ resetSuccess = false }: { resetSuccess?: boolean }) {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);
  const [globalError, setGlobalError] = useState("");
  const [successMessage] = useState(
    resetSuccess ? "Mot de passe mis à jour. Vous pouvez vous connecter." : "",
  );
  const [capsLockOn, setCapsLockOn] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });

  const {
    register,
    handleSubmit,
    watch,
    clearErrors,
    formState: { isSubmitting },
  } = useForm<LoginFormValues>({
    defaultValues: { email: "", password: "" },
    mode: "onSubmit",
  });

  const email = watch("email");
  const password = watch("password");
  const isEmpty = !email?.trim() || !password;

  const emailError = getFieldErrorMessage("email", email ?? "", touched.email);
  const passwordError = getFieldErrorMessage("password", password ?? "", touched.password);

  useEffect(() => {
    document.getElementById("admin-email")?.focus();
  }, []);

  const clearGlobalError = () => {
    if (globalError) setGlobalError("");
  };

  const onSubmit = async (values: LoginFormValues) => {
    setTouched({ email: true, password: true });
    setGlobalError("");

    const emailErr = getFieldErrorMessage("email", values.email, true);
    const pwdErr = getFieldErrorMessage("password", values.password, true);
    if (emailErr || pwdErr) return;

    try {
      const session = await loginAdmin(values.email.trim(), values.password);

      if (session.user.role !== "ADMIN") {
        setGlobalError(GENERIC_LOGIN_ERROR);
        return;
      }

      setSession(
        {
          id: session.user.id,
          email: session.user.email,
          phone: session.user.phone,
          role: session.user.role,
        },
        session.accessToken,
      );
      router.replace("/admin");
    } catch (err) {
      setGlobalError(getLoginErrorMessage(err));
    }
  };

  const { ref: emailRef, ...emailReg } = register("email", {
    onChange: () => {
      clearErrors("email");
      clearGlobalError();
    },
    onBlur: () => setTouched((t) => ({ ...t, email: true })),
  });

  const { ref: passwordRef, ...passwordReg } = register("password", {
    onChange: () => {
      clearErrors("password");
      clearGlobalError();
    },
    onBlur: () => setTouched((t) => ({ ...t, password: true })),
  });

  const handleCapsLock = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setCapsLockOn(e.getModifierState("CapsLock"));
  };

  return (
    <div className="flex min-h-[calc(100vh-73px)] w-full flex-1 items-center justify-center bg-page p-4 lg:min-h-screen lg:w-[45%] lg:p-8">
      <div className="w-full max-w-[400px] rounded-2xl border border-dep-border bg-white p-6 shadow-[0_8px_40px_rgba(15,30,53,0.08)] lg:p-8">
        <div className="mb-8 text-center lg:text-left">
          <h2 className="mb-1 font-syne text-2xl font-extrabold tracking-tight text-navy">
            Connexion Admin
          </h2>
          <p className="font-dm text-sm text-dep-gray">
            Accès réservé à l&apos;équipe DEPANNI.ma
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {globalError && <AuthErrorBanner>{globalError}</AuthErrorBanner>}
          {successMessage && !globalError && (
            <div
              role="status"
              className="mb-4 rounded-xl border border-navy/10 bg-navy/[0.04] px-3 py-2.5 font-dm text-sm text-navy"
            >
              {successMessage}
            </div>
          )}

          <div className="mb-4 space-y-2">
            <label
              htmlFor="admin-email"
              className="block font-dm text-xs font-semibold uppercase tracking-wide text-navy"
            >
              Email
            </label>
            <AuthTextInput
              id="admin-email"
              icon={Mail}
              type="email"
              inputMode="email"
              autoComplete="username"
              autoFocus
              placeholder="exemple@email.ma"
              hasError={!!emailError}
              aria-describedby={emailError ? "admin-email-error" : undefined}
              {...emailReg}
              ref={emailRef}
            />
            {emailError && (
              <p id="admin-email-error" role="alert" className="text-sm text-dep-red">
                {emailError}
              </p>
            )}
          </div>

          <div className="mb-6 space-y-2">
            <div className="flex items-center justify-between gap-3">
              <label
                htmlFor="admin-password"
                className="font-dm text-xs font-semibold uppercase tracking-wide text-navy"
              >
                Mot de passe
              </label>
              <Link
                href="/login/forgot"
                className="font-dm text-xs font-medium text-orange transition-colors duration-200 hover:text-orange-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange"
              >
                Mot de passe oublié ?
              </Link>
            </div>
            <PasswordInput
              id="admin-password"
              hasError={!!passwordError}
              capsLockOn={capsLockOn}
              autoComplete="current-password"
              aria-describedby={
                [
                  passwordError ? "admin-password-error" : null,
                  capsLockOn ? "admin-password-caps" : null,
                ]
                  .filter(Boolean)
                  .join(" ") || undefined
              }
              onKeyDown={handleCapsLock}
              onKeyUp={handleCapsLock}
              {...passwordReg}
              ref={passwordRef}
            />
            {passwordError && (
              <p id="admin-password-error" role="alert" className="text-sm text-dep-red">
                {passwordError}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting || isEmpty}
            className="mb-4 flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-navy font-dm text-[15px] font-semibold text-white transition-all duration-200 hover:bg-navy-2 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
          >
            {isSubmitting ? (
              <>
                <span
                  className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
                  aria-hidden
                />
                Connexion en cours...
              </>
            ) : (
              <>
                Se connecter
                <ArrowRight className="h-4 w-4" aria-hidden />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 border-t border-dep-border pt-5 text-center">
          <p className="font-dm text-[11px] text-dep-gray">
            Connexion sécurisée SSL · DEPANNI.ma © 2026
          </p>
        </div>
      </div>
    </div>
  );
}
