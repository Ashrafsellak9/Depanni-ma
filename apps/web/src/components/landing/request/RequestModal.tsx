"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

import {
  RequestStepConfirm,
  RequestStepContact,
  RequestStepFooter,
  RequestStepLocation,
  RequestStepService,
} from "@/components/landing/request/RequestSteps";
import { cn } from "@/lib/utils";
import { useRequestModal } from "@/store/requestModalStore";

const FOCUSABLE =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function Progress({ step }: { step: 1 | 2 | 3 | 4 }) {
  if (step === 4) return null;
  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink/45">
        Étape {step} / 3
      </p>
      <div className="mt-2 flex items-center gap-1.5" aria-hidden>
        {([1, 2, 3] as const).map((n) => (
          <span
            key={n}
            className={cn(
              "h-1 rounded-full transition-all duration-200",
              n === step ? "w-8 bg-rust" : n < step ? "w-6 bg-rust/60" : "w-6 bg-line",
            )}
          />
        ))}
      </div>
    </div>
  );
}

export function RequestModal() {
  const reduced = useReducedMotion();
  const router = useRouter();
  const open = useRequestModal((s) => s.open);
  const step = useRequestModal((s) => s.step);
  const closeModal = useRequestModal((s) => s.closeModal);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    const body = document.body;
    const prevHtml = html.style.overflow;
    const prevBody = body.style.overflow;
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    return () => {
      html.style.overflow = prevHtml;
      body.style.overflow = prevBody;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeModal();
        return;
      }
      if (e.key !== "Tab") return;
      const root = panelRef.current;
      if (!root) return;
      const items = [...root.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
        (el) => !el.hasAttribute("disabled") && el.offsetParent !== null,
      );
      const first = items[0];
      const last = items[items.length - 1];
      if (!first || !last) return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, closeModal, step]);

  useEffect(() => {
    if (!open) return;
    const id = window.requestAnimationFrame(() => panelRef.current?.focus());
    return () => window.cancelAnimationFrame(id);
  }, [open, step]);

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            aria-hidden
            initial={reduced ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduced ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.2 }}
            className="absolute inset-0 bg-ink/75 backdrop-blur-sm"
            onClick={closeModal}
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="request-modal-title"
            tabIndex={-1}
            initial={reduced ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduced ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.96 }}
            transition={{ duration: reduced ? 0 : 0.22, ease: "easeOut" }}
            className="relative z-10 flex h-auto max-h-full min-h-0 w-full max-w-[560px] flex-col overflow-hidden rounded-2xl bg-paper shadow-lift outline-none sm:rounded-3xl"
          >
            <p className="sr-only">
              {step === 4
                ? "Demande envoyée. Un conseiller va vous rappeler."
                : `Formulaire de demande d'artisan, étape ${step} sur 3. Appuyez sur Échap ou cliquez à l'extérieur pour fermer.`}
            </p>
            <header className="flex shrink-0 items-start justify-between gap-4 px-5 pt-5 sm:px-8 sm:pt-7">
              <Progress step={step} />
              <button
                type="button"
                onClick={closeModal}
                aria-label="Fermer"
                className="-mr-1 -mt-1 flex size-10 items-center justify-center rounded-full text-ink/55 transition-colors hover:bg-paper-2 hover:text-ink"
              >
                <X className="size-5" strokeWidth={1.75} />
              </button>
            </header>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-8 sm:py-6">
              {step === 1 ? <RequestStepService /> : null}
              {step === 2 ? <RequestStepLocation /> : null}
              {step === 3 ? <RequestStepContact /> : null}
              {step === 4 ? (
                <RequestStepConfirm
                  onDownloadApp={() => {
                    closeModal();
                    router.push("/#cta");
                  }}
                />
              ) : null}
            </div>

            {step !== 4 ? (
              <footer className="shrink-0 border-t border-line/70 bg-paper px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-8">
                <RequestStepFooter />
              </footer>
            ) : null}
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
