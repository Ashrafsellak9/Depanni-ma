/** Cookie-based mock auth for artisan space — replace with JWT/API in production */

export type ArtisanAuthStatus = "approved" | "pending";

export interface ArtisanRegisterData {
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  password: string;
  ville: string;
  services: string[];
  radiusKm: number;
  experience: string;
}

export interface ArtisanLoginResult {
  success: boolean;
  status?: ArtisanAuthStatus;
  error?: string;
}

const COOKIE_OPTS = "path=/; max-age=86400; SameSite=Lax";

function setCookie(name: string, value: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=${encodeURIComponent(value)}; ${COOKIE_OPTS}`;
}

function clearCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; path=/; max-age=0`;
}

export function getArtisanCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match?.[1] ? decodeURIComponent(match[1]) : undefined;
}

function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, "");
}

export const artisanAuth = {
  login(credentials: { phone: string; password: string }): ArtisanLoginResult {
    const p = normalizePhone(credentials.phone);

    if (p === "0600000000" && credentials.password === "demo2026") {
      setCookie("artisan_token", "mock_jwt_khalid");
      setCookie("artisan_status", "approved");
      setCookie("artisan_name", "Khalid Amrani");
      setCookie("artisan_initials", "KA");
      return { success: true, status: "approved" };
    }

    if (p === "0611111111" && credentials.password === "demo2026") {
      setCookie("artisan_token", "mock_jwt_rachid");
      setCookie("artisan_status", "pending");
      setCookie("artisan_name", "Rachid El Filali");
      setCookie("artisan_initials", "RF");
      return { success: true, status: "pending" };
    }

    return { success: false, error: "Numéro ou mot de passe incorrect" };
  },

  logout() {
    clearCookie("artisan_token");
    clearCookie("artisan_status");
    clearCookie("artisan_name");
    clearCookie("artisan_initials");
  },

  register(data: ArtisanRegisterData) {
    const initials = `${data.firstName[0] ?? ""}${data.lastName[0] ?? ""}`.toUpperCase();
    setCookie("artisan_token", "mock_jwt_new");
    setCookie("artisan_status", "pending");
    setCookie("artisan_name", `${data.firstName} ${data.lastName}`);
    setCookie("artisan_initials", initials);
    return { success: true as const };
  },

  isAuthenticated(): boolean {
    return Boolean(getArtisanCookie("artisan_token"));
  },

  getStatus(): ArtisanAuthStatus | undefined {
    const s = getArtisanCookie("artisan_status");
    if (s === "approved" || s === "pending") return s;
    return undefined;
  },
};
