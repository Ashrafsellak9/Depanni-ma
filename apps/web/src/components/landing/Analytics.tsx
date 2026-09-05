"use client";

import { useEffect } from "react";

import {
  COOKIE_CONSENT_EVENT,
  readCookieConsent,
  type CookieConsent,
} from "@/lib/cookieConsent";

function applyAnalytics(consent: CookieConsent | null) {
  const enabled = Boolean(consent?.categories.audience);
  if (enabled) {
    // TODO: brancher Plausible / GA4 ici une fois le domaine de production connu.
    return;
  }
  // TODO: décharger le script analytics si un consentement audience est retiré.
}

export function Analytics() {
  useEffect(() => {
    applyAnalytics(readCookieConsent());
    const onChange = (event: Event) => {
      applyAnalytics((event as CustomEvent<CookieConsent>).detail);
    };
    window.addEventListener(COOKIE_CONSENT_EVENT, onChange);
    return () => window.removeEventListener(COOKIE_CONSENT_EVENT, onChange);
  }, []);

  return null;
}
