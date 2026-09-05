"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

import {
  REQUEST_DISTRICTS,
  REQUEST_FIELD_CLASS,
  REQUEST_SERVICES,
  formatScheduledAt,
  isValidMaPhone,
  maskPhone,
  minDateTimeLocal,
  normalizePhone,
} from "@/components/landing/request/requestConstants";
import { LandingButton } from "@/components/landing/ui/LandingButton";
import { Accent, DisplayTitle } from "@/components/ui/display-title";
import { cn } from "@/lib/utils";
import { type RequestDraft, useRequestModal } from "@/store/requestModalStore";

function Spinner({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.25" />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 12 12"
          to="360 12 12"
          dur="0.7s"
          repeatCount="indefinite"
        />
      </path>
    </svg>
  );
}

export function canContinueRequestStep(step: 1 | 2 | 3, draft: RequestDraft) {
  if (step === 1) return Boolean(draft.service);
  if (step === 2) {
    return draft.district.length > 0 && (draft.urgency === "asap" || Boolean(draft.scheduledAt));
  }
  const phoneOk = isValidMaPhone(draft.phone);
  const emailOk = !draft.email.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email.trim());
  return draft.firstName.trim().length > 1 && phoneOk && emailOk && draft.cgu;
}

export function RequestStepService() {
  const draft = useRequestModal((s) => s.draft);
  const patchDraft = useRequestModal((s) => s.patchDraft);

  return (
    <>
      <DisplayTitle as="h2" size="display-3" id="request-modal-title" className="pr-10">
        De quoi avez-vous <Accent>besoin</Accent>&nbsp;?
      </DisplayTitle>
      <div className="mt-5 grid grid-cols-2 gap-2 md:grid-cols-4">
        {REQUEST_SERVICES.map((s) => {
          const selected = draft.service === s.id;
          const Icon = s.icon;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => patchDraft({ service: s.id })}
              className={cn(
                "flex min-h-[84px] flex-col items-center justify-center gap-1.5 rounded-2xl border px-2 py-3 text-center transition-colors duration-200",
                selected
                  ? "border-rust bg-rust/5 text-ink"
                  : "border-line bg-white text-ink hover:border-ink/25",
              )}
            >
              <Icon className={cn("size-5", selected ? "text-rust" : "text-ink/70")} strokeWidth={1.75} />
              <span className="font-sans text-[13px] font-medium leading-tight">{s.label}</span>
            </button>
          );
        })}
      </div>
      <label className="mt-5 mb-1 block">
        <span className="mb-1.5 block font-sans text-sm text-ink/70">Décrivez brièvement (facultatif)</span>
        <textarea
          rows={3}
          value={draft.description}
          onChange={(e) => patchDraft({ description: e.target.value })}
          placeholder="Fuite sous l'évier, disjoncteur qui saute…"
          className={cn(REQUEST_FIELD_CLASS, "resize-none")}
        />
      </label>
    </>
  );
}

export function RequestStepLocation() {
  const draft = useRequestModal((s) => s.draft);
  const patchDraft = useRequestModal((s) => s.patchDraft);

  return (
    <>
      <DisplayTitle as="h2" size="display-3" id="request-modal-title" className="pr-10">
        Où et <Accent>quand</Accent>&nbsp;?
      </DisplayTitle>

      <label className="mt-5 block">
        <span className="mb-1.5 block font-sans text-sm text-ink/70">Quartier</span>
        <select
          value={draft.district}
          onChange={(e) => patchDraft({ district: e.target.value })}
          className={REQUEST_FIELD_CLASS}
        >
          <option value="">Choisir un quartier</option>
          {REQUEST_DISTRICTS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </label>

      <label className="mt-4 block">
        <span className="mb-1.5 block font-sans text-sm text-ink/70">Adresse (facultatif)</span>
        <input
          type="text"
          autoComplete="street-address"
          value={draft.address}
          onChange={(e) => patchDraft({ address: e.target.value })}
          placeholder="N° et rue, immeuble…"
          className={REQUEST_FIELD_CLASS}
        />
      </label>

      <fieldset className="mt-5">
        <legend className="sr-only">Urgence</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {(
            [
              { id: "asap" as const, label: "Le plus vite possible" },
              { id: "schedule" as const, label: "Planifier" },
            ]
          ).map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() =>
                patchDraft({
                  urgency: opt.id,
                  ...(opt.id === "asap" ? { scheduledAt: "" } : {}),
                })
              }
              className={cn(
                "rounded-2xl border px-4 py-4 text-left font-sans text-sm font-medium transition-colors",
                draft.urgency === opt.id
                  ? "border-rust bg-rust/5 text-ink"
                  : "border-line bg-white text-ink hover:border-ink/25",
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </fieldset>

      {draft.urgency === "schedule" ? (
        <label className="mt-4 block">
          <span className="mb-1.5 block font-sans text-sm text-ink/70">Date et heure</span>
          <input
            type="datetime-local"
            min={minDateTimeLocal()}
            value={draft.scheduledAt}
            onChange={(e) => patchDraft({ scheduledAt: e.target.value })}
            className={REQUEST_FIELD_CLASS}
          />
        </label>
      ) : null}
    </>
  );
}

export function RequestStepContact() {
  const draft = useRequestModal((s) => s.draft);
  const patchDraft = useRequestModal((s) => s.patchDraft);
  const error = useRequestModal((s) => s.error);

  const [phoneTouched, setPhoneTouched] = useState(false);
  const phoneOk = isValidMaPhone(draft.phone);

  return (
    <>
      <DisplayTitle as="h2" size="display-3" id="request-modal-title" className="pr-10">
        On vous rappelle dans quelques <Accent>instants</Accent>.
      </DisplayTitle>
      <div className="mt-5 space-y-4">
        <label className="block">
          <span className="mb-1.5 block font-sans text-sm text-ink/70">Prénom</span>
          <input
            type="text"
            autoComplete="given-name"
            required
            value={draft.firstName}
            onChange={(e) => patchDraft({ firstName: e.target.value })}
            className={REQUEST_FIELD_CLASS}
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block font-sans text-sm text-ink/70">Téléphone</span>
          <input
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            required
            placeholder="06 12 34 56 78"
            value={draft.phone}
            onBlur={() => setPhoneTouched(true)}
            onChange={(e) => patchDraft({ phone: e.target.value })}
            className={cn(REQUEST_FIELD_CLASS, "font-mono")}
            aria-invalid={phoneTouched && !phoneOk}
          />
          {phoneTouched && !phoneOk ? (
            <span className="mt-1.5 block text-xs text-rust">
              Entrez un numéro marocain (06/07/05 ou +212).
            </span>
          ) : null}
        </label>
        <label className="block">
          <span className="mb-1.5 block font-sans text-sm text-ink/70">Email (optionnel)</span>
          <input
            type="email"
            autoComplete="email"
            value={draft.email}
            onChange={(e) => patchDraft({ email: e.target.value })}
            className={REQUEST_FIELD_CLASS}
          />
        </label>
        <label className="flex items-start gap-3 pt-1">
          <input
            type="checkbox"
            checked={draft.cgu}
            onChange={(e) => patchDraft({ cgu: e.target.checked })}
            className="mt-1 h-4 w-4 shrink-0 accent-rust"
          />
          <span className="font-sans text-sm text-ink/70">
            J&apos;accepte les{" "}
            <Link href="/cgu" target="_blank" rel="noopener noreferrer" className="text-ink underline-grow">
              CGU
            </Link>
            , la{" "}
            <Link
              href="/politique-confidentialite"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink underline-grow"
            >
              politique de confidentialité
            </Link>{" "}
            et le traitement de mes données conformément à la loi&nbsp;09-08.
          </span>
        </label>
      </div>
      {error ? <p className="mt-4 text-sm text-rust">{error}</p> : null}
    </>
  );
}

export async function submitRequestDraft() {
  const state = useRequestModal.getState();
  if (state.submitting) return false;
  if (!canContinueRequestStep(3, state.draft)) return false;

  const { draft, setSubmitting, setError, setStep } = state;
  setSubmitting(true);
  setError(null);
  try {
    const service = REQUEST_SERVICES.find((s) => s.id === draft.service);
    const res = await fetch("/api/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service: draft.service,
        serviceLabel: service?.label,
        description: draft.description,
        district: draft.district,
        address: draft.address || null,
        urgency: draft.urgency,
        scheduledAt: draft.scheduledAt || null,
        firstName: draft.firstName.trim(),
        phone: normalizePhone(draft.phone),
        email: draft.email.trim() || null,
      }),
    });
    if (!res.ok || !res.headers.get("content-type")?.includes("application/json")) {
      throw new Error("fail");
    }
    setStep(4);
    return true;
  } catch {
    const message = "Impossible d'envoyer la demande. Réessayez.";
    setError(message);
    window.alert(message);
    return false;
  } finally {
    setSubmitting(false);
  }
}

export function RequestStepConfirm({ onDownloadApp }: { onDownloadApp: () => void }) {
  const draft = useRequestModal((s) => s.draft);
  const closeModal = useRequestModal((s) => s.closeModal);
  const service = REQUEST_SERVICES.find((s) => s.id === draft.service);

  return (
    <div className="text-center">
      <CheckMark />
      <DisplayTitle as="h2" size="display-3" id="request-modal-title" className="mt-6">
        C&apos;est <Accent>parti</Accent>&nbsp;!
      </DisplayTitle>
      <p className="mx-auto mt-3 max-w-[42ch] text-base text-ink/70">
        Nous cherchons le meilleur artisan pour vous. Un conseiller vous rappelle sous 3 minutes au{" "}
        <span className="num font-mono text-ink">{maskPhone(draft.phone)}</span>.
      </p>
      <dl className="mx-auto mt-6 max-w-sm space-y-2 rounded-2xl border border-line bg-white px-4 py-3 text-left">
        <RecapRow label="Service" value={service?.label ?? "—"} />
        <RecapRow
          label="Lieu"
          value={draft.address ? `${draft.district} — ${draft.address}` : draft.district}
        />
        <RecapRow
          label="Quand"
          value={
            draft.urgency === "asap"
              ? "Dès que possible"
              : formatScheduledAt(draft.scheduledAt) || "Planifié"
          }
        />
      </dl>
      <div className="mt-8 flex flex-col gap-3">
        <LandingButton className="w-full" variant="ink" onClick={onDownloadApp} event="request-download-app">
          Télécharger l&apos;app
        </LandingButton>
        <LandingButton className="w-full" variant="ghost" onClick={closeModal}>
          Fermer
        </LandingButton>
      </div>
    </div>
  );
}

function RecapRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="font-sans text-xs uppercase tracking-wider text-ink/45">{label}</dt>
      <dd className="font-sans text-sm font-medium text-ink">{value}</dd>
    </div>
  );
}

function CheckMark() {
  const reduced = useReducedMotion();
  return (
    <div className="flex justify-center" aria-hidden>
      <motion.svg viewBox="0 0 64 64" className="size-16 text-rust">
        <motion.circle
          cx="32"
          cy="32"
          r="28"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          initial={{ pathLength: reduced ? 1 : 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: reduced ? 0 : 0.45, ease: "easeOut" }}
        />
        <motion.path
          d="M18 33.5 27.5 43 46 22"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: reduced ? 1 : 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: reduced ? 0 : 0.4, delay: reduced ? 0 : 0.22, ease: "easeOut" }}
        />
      </motion.svg>
    </div>
  );
}

export function RequestStepFooter() {
  const step = useRequestModal((s) => s.step);
  const draft = useRequestModal((s) => s.draft);
  const setStep = useRequestModal((s) => s.setStep);
  const submitting = useRequestModal((s) => s.submitting);

  if (step === 4) return null;

  const canContinue = canContinueRequestStep(step, draft) && !submitting;

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      {step > 1 ? (
        <LandingButton
          variant="ghost"
          className="w-full sm:w-auto"
          disabled={submitting}
          onClick={() => setStep((step - 1) as 1 | 2)}
        >
          Retour
        </LandingButton>
      ) : null}
      <LandingButton
        className="w-full flex-1"
        disabled={!canContinue}
        onClick={() => {
          if (step === 3) {
            void submitRequestDraft();
            return;
          }
          setStep((step + 1) as 2 | 3);
        }}
        event={step === 3 ? "request-submit" : `request-step${step}-continue`}
      >
        {step === 3 ? (
          submitting ? (
            <>
              <Spinner className="h-5 w-5" />
              Envoi…
            </>
          ) : (
            "Envoyer ma demande"
          )
        ) : (
          "Continuer"
        )}
      </LandingButton>
    </div>
  );
}
