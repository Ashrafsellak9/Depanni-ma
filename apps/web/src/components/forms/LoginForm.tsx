"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { getSession, signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

import { redirectAfterLogin } from "@/auth";
import { getApiErrorMessage } from "@/lib/api";
import { cn } from "@/lib/utils";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Veuillez saisir une adresse email valide")
    .email("Veuillez saisir une adresse email valide"),
  password: z.string().min(1, "Le mot de passe est requis"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const inputBase =
  "min-h-[48px] w-full rounded-xl border bg-white pl-10 pr-4 text-sm text-navy outline-none transition-all duration-200 placeholder:text-dep-gray focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50";

const inputNormal =
  "border-dep-border focus:border-orange focus:ring-orange/20";

const inputError =
  "border-dep-red bg-dep-red/[0.04] focus:border-dep-red focus:ring-dep-red/20";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const [showPassword, setShowPassword] = useState(false);
  const [globalError, setGlobalError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const email = watch("email");
  const password = watch("password");
  const isEmpty = !email?.trim() || !password?.trim();

  const clearFieldError = (field: keyof LoginFormValues) => {
    clearErrors(field);
    setGlobalError("");
  };

  const onSubmit = async (values: LoginFormValues) => {
    setGlobalError("");
    try {
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (result?.error) {
        setGlobalError("Email ou mot de passe incorrect");
        return;
      }

      toast.success("Connexion réussie");
      const session = await getSession();
      const role = session?.user?.role;
      const target = callbackUrl ?? (role ? redirectAfterLogin(role) : "/dashboard");
      router.push(target);
      router.refresh();
    } catch (err) {
      setGlobalError(getApiErrorMessage(err));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5" noValidate>
      {globalError && (
        <div
          role="alert"
          className="flex items-center gap-2 rounded-xl border border-dep-red/15 bg-dep-red/[0.06] px-3 py-2.5"
        >
          <AlertCircle className="h-4 w-4 shrink-0 text-dep-red" aria-hidden />
          <span className="text-sm text-dep-red">{globalError}</span>
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-semibold text-navy">
          Email
        </label>
        <div className="relative">
          <Mail
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-dep-gray"
            aria-hidden
          />
          <input
            id="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            autoFocus
            placeholder="exemple@email.ma"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={cn(inputBase, errors.email ? inputError : inputNormal)}
            {...register("email", { onChange: () => clearFieldError("email") })}
          />
        </div>
        {errors.email && (
          <p id="email-error" role="alert" className="flex items-center gap-1.5 text-sm text-dep-red">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden />
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <label htmlFor="password" className="text-sm font-semibold text-navy">
            Mot de passe
          </label>
          <Link
            href="/forgot-password"
            className="text-sm font-medium text-orange transition-colors duration-200 hover:underline"
          >
            Mot de passe oublié ?
          </Link>
        </div>
        <div className="relative">
          <Lock
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-dep-gray"
            aria-hidden
          />
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Votre mot de passe"
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? "password-error" : undefined}
            className={cn(inputBase, "pr-11", errors.password ? inputError : inputNormal)}
            {...register("password", { onChange: () => clearFieldError("password") })}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-dep-gray transition-colors duration-200 hover:text-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2"
            aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" aria-hidden />
            ) : (
              <Eye className="h-4 w-4" aria-hidden />
            )}
          </button>
        </div>
        {errors.password && (
          <p id="password-error" role="alert" className="flex items-center gap-1.5 text-sm text-dep-red">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden />
            {errors.password.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting || isEmpty}
        className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-orange text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:brightness-[0.92] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none disabled:hover:brightness-100"
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
          "Se connecter"
        )}
      </button>

      <p className="text-center text-sm text-dep-gray">
        Pas encore de compte ?{" "}
        <Link
          href="/register"
          className="inline-flex min-h-[44px] items-center font-semibold text-orange hover:underline"
        >
          S&apos;inscrire
        </Link>
      </p>
    </form>
  );
}
