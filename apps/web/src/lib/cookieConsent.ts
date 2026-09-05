export const COOKIE_CONSENT_KEY = "cookie-consent";
export const COOKIE_CONSENT_EVENT = "cookieConsentChange";

export type CookieCategories = {
  essential: true;
  audience: boolean;
  marketing: boolean;
};

export type CookieConsent = {
  choice: "all" | "none" | "custom";
  timestamp: number;
  categories: CookieCategories;
};

export function readCookieConsent(): CookieConsent | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(COOKIE_CONSENT_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as CookieConsent;
  } catch {
    return null;
  }
}

export function writeCookieConsent(consent: CookieConsent): void {
  window.localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consent));
  window.dispatchEvent(new CustomEvent(COOKIE_CONSENT_EVENT, { detail: consent }));
}

export function consentAll(): CookieConsent {
  return {
    choice: "all",
    timestamp: Date.now(),
    categories: { essential: true, audience: true, marketing: true },
  };
}

export function consentNone(): CookieConsent {
  return {
    choice: "none",
    timestamp: Date.now(),
    categories: { essential: true, audience: false, marketing: false },
  };
}

export function consentCustom(categories: Pick<CookieCategories, "audience" | "marketing">): CookieConsent {
  return {
    choice: "custom",
    timestamp: Date.now(),
    categories: { essential: true, ...categories },
  };
}
