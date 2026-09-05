"use client";

import axios from "axios";
import { ArrowLeft, ArrowRight, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { AuthErrorBanner } from "@/components/auth/AuthErrorBanner";
import { AuthTextInput } from "@/components/auth/AuthTextInput";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { forgotAdminPassword, resetAdminPassword } from "@/services/adminApi";

type Step = "email" | "otp" | "password";

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const code = (error.response?.data as { error?: { code?: string } } | undefined)?.error
      ?.code;
    if (status === 429 || code === "RATE_LIMIT" || code === "OTP_LOCKED") {
      return "Trop de tentatives. Réessayez plus tard.";
    }
    const message = (error.response?.data as { error?: { message?: string } } | undefined)
      ?.error?.message;
    if (message) return message;
  }
  return "Une erreur est survenue. Réessayez.";
}

function isValidPassword(password: string): string | undefined {
  if (password.length < 8) return "Minimum 8 caractères";
  if (!/[A-Z]/.test(password)) return "Au moins une majuscule";
  if (!/[0-9]/.test(password)) return "Au moins un chiffre";
  return undefined;
}

export function AdminForgotPasswordForm() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [capsLockOn, setCapsLockOn] = useState(false);

  useEffect(() => {
    document.getElementById("admin-forgot-email")?.focus();
  }, []);

  const sendCode = async () => {
    setError("");
    setInfo("");
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError("Veuillez saisir une adresse email valide");
      return;
    }

    setLoading(true);
    try {
      const result = await forgotAdminPassword(trimmed);
      setEmail(trimmed);
      setInfo(
        result.devOtp
          ? `${result.message} Code de développement : ${result.devOtp}`
          : result.message,
      );
      if (result.devOtp) setCode(result.devOtp);
      setStep("otp");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const resendCode = async () => {
    setError("");
    setLoading(true);
    try {
      const result = await forgotAdminPassword(email);
      setInfo(result.message);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const goToPassword = () => {
    setError("");
    if (!/^\d{6}$/.test(code)) {
      setError("Saisissez le code à 6 chiffres");
      return;
    }
    setStep("password");
  };

  const submitPassword = async () => {
    setError("");
    const pwdError = isValidPassword(password);
    if (pwdError) {
      setError(pwdError);
      return;
    }
    if (password !== confirm) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    setLoading(true);
    try {
      await resetAdminPassword({ email, code, password });
      router.replace("/login?reset=1");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleCapsLock = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setCapsLockOn(e.getModifierState("CapsLock"));
  };

  return (
    <div className="flex min-h-[calc(100vh-73px)] w-full flex-1 items-center justify-center bg-page p-4 lg:min-h-screen lg:w-[45%] lg:p-8">
      <div className="w-full max-w-[400px] rounded-2xl border border-dep-border bg-white p-6 shadow-[0_8px_40px_rgba(15,30,53,0.08)] lg:p-8">
        <div className="mb-6">
          <Link
            href="/login"
            className="mb-4 inline-flex items-center gap-1.5 font-dm text-sm font-medium text-dep-gray transition-colors duration-200 hover:text-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Retour à la connexion
          </Link>
          <h2 className="mb-1 font-syne text-2xl font-extrabold tracking-tight text-navy">
            Mot de passe oublié
          </h2>
          <p className="font-dm text-sm text-dep-gray">
            {step === "email" && "Recevez un code de vérification sur le téléphone lié au compte."}
            {step === "otp" && "Saisissez le code à 6 chiffres reçu par SMS."}
            {step === "password" && "Choisissez un nouveau mot de passe sécurisé."}
          </p>
        </div>

        {error && <AuthErrorBanner>{error}</AuthErrorBanner>}
        {info && !error && (
          <div
            role="status"
            className="mb-4 rounded-xl border border-navy/10 bg-navy/[0.04] px-3 py-2.5 font-dm text-sm text-navy"
          >
            {info}
          </div>
        )}

        {step === "email" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="admin-forgot-email"
                className="block font-dm text-xs font-semibold uppercase tracking-wide text-navy"
              >
                Email admin
              </label>
              <AuthTextInput
                id="admin-forgot-email"
                icon={Mail}
                type="email"
                inputMode="email"
                autoComplete="username"
                placeholder="exemple@email.ma"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    void sendCode();
                  }
                }}
              />
            </div>
            <button
              type="button"
              disabled={loading || !email.trim()}
              onClick={() => void sendCode()}
              className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-navy font-dm text-[15px] font-semibold text-white transition-all duration-200 hover:bg-navy-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Envoi en cours..." : "Envoyer le code"}
              {!loading && <ArrowRight className="h-4 w-4" aria-hidden />}
            </button>
          </div>
        )}

        {step === "otp" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="admin-forgot-otp"
                className="block font-dm text-xs font-semibold uppercase tracking-wide text-navy"
              >
                Code OTP
              </label>
              <AuthTextInput
                id="admin-forgot-otp"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="123456"
                maxLength={6}
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.replace(/\D/g, "").slice(0, 6));
                  setError("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    goToPassword();
                  }
                }}
              />
            </div>
            <button
              type="button"
              disabled={loading || code.length !== 6}
              onClick={goToPassword}
              className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-navy font-dm text-[15px] font-semibold text-white transition-all duration-200 hover:bg-navy-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Continuer
              <ArrowRight className="h-4 w-4" aria-hidden />
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => void resendCode()}
              className="w-full font-dm text-sm font-medium text-orange transition-colors duration-200 hover:text-orange-2 disabled:opacity-50"
            >
              Renvoyer le code
            </button>
          </div>
        )}

        {step === "password" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="admin-forgot-password"
                className="block font-dm text-xs font-semibold uppercase tracking-wide text-navy"
              >
                Nouveau mot de passe
              </label>
              <PasswordInput
                id="admin-forgot-password"
                autoComplete="new-password"
                placeholder="Minimum 8 caractères"
                value={password}
                capsLockOn={capsLockOn}
                onKeyDown={handleCapsLock}
                onKeyUp={handleCapsLock}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
              />
              <p className="font-dm text-xs text-dep-gray">
                8 caractères minimum, une majuscule et un chiffre.
              </p>
            </div>
            <div className="space-y-2">
              <label
                htmlFor="admin-forgot-confirm"
                className="block font-dm text-xs font-semibold uppercase tracking-wide text-navy"
              >
                Confirmer
              </label>
              <PasswordInput
                id="admin-forgot-confirm"
                autoComplete="new-password"
                placeholder="Répétez le mot de passe"
                value={confirm}
                onChange={(e) => {
                  setConfirm(e.target.value);
                  setError("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    void submitPassword();
                  }
                }}
              />
            </div>
            <button
              type="button"
              disabled={loading || !password || !confirm}
              onClick={() => void submitPassword()}
              className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-navy font-dm text-[15px] font-semibold text-white transition-all duration-200 hover:bg-navy-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Mise à jour..." : "Réinitialiser le mot de passe"}
            </button>
          </div>
        )}

        <div className="mt-6 border-t border-dep-border pt-5 text-center">
          <p className="font-dm text-[11px] text-dep-gray">
            Connexion sécurisée SSL · DEPANNI.ma © 2026
          </p>
        </div>
      </div>
    </div>
  );
}
