"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Link from "next/link";
import { useEffect, useState } from "react";

import {
  consentAll,
  consentCustom,
  consentNone,
  readCookieConsent,
  writeCookieConsent,
  type CookieConsent,
} from "@/lib/cookieConsent";
import { Accent, DisplayTitle } from "@/components/ui/display-title";
import { cn } from "@/lib/utils";

function Toggle({
  checked,
  onCheckedChange,
  disabled,
  label,
}: {
  checked: boolean;
  onCheckedChange?: (next: boolean) => void;
  disabled?: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onCheckedChange?.(!checked)}
      className={cn(
        "relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200",
        checked ? "bg-rust" : "bg-line",
        disabled && "cursor-not-allowed opacity-50",
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 left-0.5 block size-5 rounded-full bg-white transition-transform duration-200",
          checked && "translate-x-5",
        )}
      />
    </button>
  );
}

const ghostBtn =
  "inline-flex min-h-[44px] items-center justify-center rounded-full border border-white/25 px-4 font-sans text-sm font-medium text-white transition-colors hover:bg-white/10";

export function CookieBanner() {
  const [ready, setReady] = useState(false);
  const [consent, setConsent] = useState<CookieConsent | null>(null);
  const [customize, setCustomize] = useState(false);
  const [audience, setAudience] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const stored = readCookieConsent();
    setConsent(stored);
    if (stored) {
      setAudience(stored.categories.audience);
      setMarketing(stored.categories.marketing);
    }
    setReady(true);
  }, []);

  function save(next: CookieConsent) {
    writeCookieConsent(next);
    setConsent(next);
    setCustomize(false);
  }

  if (!ready || consent) return null;

  return (
    <>
      <aside
        className="fixed bottom-6 left-6 right-6 z-[70] rounded-2xl bg-ink p-6 text-white/90 shadow-2xl md:right-auto md:max-w-md"
        aria-labelledby="cookie-banner-title"
        aria-describedby="cookie-banner-desc"
      >
        <p id="cookie-banner-title" className="sr-only">
          Consentement cookies
        </p>
        <p id="cookie-banner-desc" className="font-sans text-sm leading-relaxed text-white/90">
          Nous utilisons des cookies pour mesurer l&apos;audience du site et améliorer votre
          expérience. Voir notre{" "}
          <Link
            href="/politique-confidentialite"
            className="underline decoration-white/40 underline-offset-2 hover:decoration-white"
          >
            politique de confidentialité
          </Link>
          .
        </p>
        <div className="mt-5 flex flex-col gap-2">
          <button type="button" className={ghostBtn} onClick={() => save(consentNone())}>
            Refuser
          </button>
          <button type="button" className={ghostBtn} onClick={() => setCustomize(true)}>
            Personnaliser
          </button>
          <button
            type="button"
            className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-rust px-4 font-sans text-sm font-medium text-white transition-colors hover:bg-rust-deep"
            onClick={() => save(consentAll())}
          >
            Tout accepter
          </button>
        </div>
      </aside>

      <Dialog.Root open={customize} onOpenChange={setCustomize}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[75] bg-ink/60 backdrop-blur-sm" />
          <Dialog.Content className="fixed bottom-4 left-1/2 z-[76] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-3xl bg-paper p-8 shadow-lift md:bottom-auto md:top-1/2 md:-translate-y-1/2">
            <Dialog.Title asChild>
              <DisplayTitle as="h2" size="display-3">
                Personnaliser les <Accent>cookies</Accent>
              </DisplayTitle>
            </Dialog.Title>
            <Dialog.Description className="sr-only">
              Choisissez les catégories de cookies autorisées.
            </Dialog.Description>
            <ul className="mt-6 space-y-4">
              <li className="flex items-center justify-between gap-4 rounded-2xl border border-line bg-white px-4 py-3">
                <div>
                  <p className="font-sans text-sm font-medium text-ink">Essentiels</p>
                  <p className="text-xs text-ink/70">Nécessaires au fonctionnement du site.</p>
                </div>
                <Toggle checked disabled label="Essentiels, toujours activés" />
              </li>
              <li className="flex items-center justify-between gap-4 rounded-2xl border border-line bg-white px-4 py-3">
                <div>
                  <p className="font-sans text-sm font-medium text-ink">Mesure d&apos;audience</p>
                  <p className="text-xs text-ink/70">Statistiques anonymisées de fréquentation.</p>
                </div>
                <Toggle checked={audience} onCheckedChange={setAudience} label="Mesure d'audience" />
              </li>
              <li className="flex items-center justify-between gap-4 rounded-2xl border border-line bg-white px-4 py-3">
                <div>
                  <p className="font-sans text-sm font-medium text-ink">Marketing</p>
                  <p className="text-xs text-ink/70">Publicités et campagnes partenaires.</p>
                </div>
                <Toggle checked={marketing} onCheckedChange={setMarketing} label="Marketing" />
              </li>
            </ul>
            <button
              type="button"
              className="mt-6 inline-flex min-h-[48px] w-full items-center justify-center rounded-full bg-rust font-sans text-sm font-medium text-white transition-colors hover:bg-rust-deep"
              onClick={() => save(consentCustom({ audience, marketing }))}
            >
              Enregistrer mes choix
            </button>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
