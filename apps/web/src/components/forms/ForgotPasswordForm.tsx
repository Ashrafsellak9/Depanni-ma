"use client";

import axios from "axios";
import { ArrowLeft, ArrowRight, Mail, Phone } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { AuthErrorBanner } from "@/components/auth/AuthErrorBanner";
import { AuthTextInput } from "@/components/auth/AuthTextInput";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { api } from "@/lib/api";
import { unwrapApi } from "@/lib/api-types";
import { toMoroccanPhone } from "@/lib/artisanAuth";

type Step = "identity" | "otp" | "password";

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const code = (error.response?.data as { error?: { code?: string } } | undefined)?.error?.code;
    if (status === 429 || code === "RATE_LIMIT" || code === "OTP_LOCKED") {
      return "Trop de tentatives. Réessayez plus tard.";
    }
    const message = (error.response?.data as { error?: { message?: string } } | undefined)?.error
      ?.message;
    if (message) return message;
  }
  return "Une erreur est survenue. Réessayez.";
}

export function ForgotPasswordForm() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("identity");
  const [mode, setMode] = useState<"email" | "phone">("phone");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  const identifier =
    mode === "email"
      ? { email: email.trim().toLowerCase() }
      : { phone: toMoroccanPhone(phone) };

  const sendCode = async () => {
    setError("");
    setInfo("");
    if (mode === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Veuillez saisir une adresse email valide");
      return;
    }
    if (mode === "phone" && !/^(\+212|0)[5-7]\d{8}$/.test(toMoroccanPhone(phone))) {
      setError("Numéro de téléphone marocain invalide");
      return;
    }

    setLoading(true);
    try {
      const result = unwrapApi<{ message: string; devOtp?: string }>(
        await api.post("/auth/forgot-password", identifier),
      );
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

  const confirmReset = async () => {
    setError("");
    if (!/^\d{6}$/.test(code)) {
      setError("Code OTP à 6 chiffres");
      return;
    }
    if (password.length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      setError("Mot de passe : 8 caractères, une majuscule et un chiffre");
      return;
    }
    if (password !== confirm) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/reset-password", { ...identifier, code, password });
      router.push("/login");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 space-y-4">
      {error && <AuthErrorBanner>{error}</AuthErrorBanner>}
      {info && (
        <p className="rounded-xl border border-green/20 bg-green/[0.06] px-3 py-2 text-sm text-navy">
          {info}
        </p>
      )}

      {step === "identity" && (
        <>
          <div className="flex rounded-xl border border-dep-border bg-cream p-1">
            <button
              type="button"
              onClick={() => setMode("phone")}
              className={`flex-1 rounded-lg py-2 text-sm font-medium ${
                mode === "phone" ? "bg-navy text-white" : "text-dep-gray"
              }`}
            >
              Téléphone
            </button>
            <button
              type="button"
              onClick={() => setMode("email")}
              className={`flex-1 rounded-lg py-2 text-sm font-medium ${
                mode === "email" ? "bg-navy text-white" : "text-dep-gray"
              }`}
            >
              Email
            </button>
          </div>
          {mode === "phone" ? (
            <AuthTextInput
              icon={Phone}
              type="tel"
              placeholder="06 12 34 56 78"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          ) : (
            <AuthTextInput
              icon={Mail}
              type="email"
              placeholder="vous@email.ma"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          )}
          <button
            type="button"
            onClick={() => void sendCode()}
            disabled={loading}
            className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-orange text-sm font-semibold text-white disabled:opacity-60"
          >
            {loading ? "Envoi…" : "Recevoir le code"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </>
      )}

      {step === "otp" && (
        <>
          <AuthTextInput
            inputMode="numeric"
            maxLength={6}
            placeholder="Code à 6 chiffres"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
          />
          <button
            type="button"
            onClick={() => setStep("password")}
            disabled={code.length !== 6}
            className="flex min-h-[48px] w-full items-center justify-center rounded-xl bg-orange text-sm font-semibold text-white disabled:opacity-60"
          >
            Continuer
          </button>
        </>
      )}

      {step === "password" && (
        <>
          <PasswordInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            showStrength
            strengthValue={password}
            ruleHint
            autoComplete="new-password"
          />
          <PasswordInput
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Confirmer le mot de passe"
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => void confirmReset()}
            disabled={loading}
            className="flex min-h-[48px] w-full items-center justify-center rounded-xl bg-orange text-sm font-semibold text-white disabled:opacity-60"
          >
            {loading ? "Enregistrement…" : "Réinitialiser"}
          </button>
        </>
      )}

      <Link
        href="/login"
        className="inline-flex min-h-[44px] items-center gap-1.5 text-sm text-dep-gray hover:text-navy"
      >
        <ArrowLeft className="h-4 w-4" /> Retour à la connexion
      </Link>
    </div>
  );
}
