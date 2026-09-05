import { api } from "@/lib/api";
import { unwrapApi } from "@/lib/api-types";
import { setAccessToken } from "@/lib/token";
import type { ArtisanProfile } from "@/types/artisan";

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

export function toMoroccanPhone(phone: string): string {
  const d = phone.replace(/\D/g, "");
  if (d.startsWith("212") && d.length === 12) return `+${d}`;
  if (d.startsWith("0") && d.length === 10) return `+212${d.slice(1)}`;
  if (d.length === 9 && /^[5-7]/.test(d)) return `+212${d}`;
  return phone.trim();
}

function persistSession(token: string, status: ArtisanAuthStatus, name: string, initials: string) {
  setAccessToken(token);
  setCookie("artisan_token", token);
  setCookie("artisan_status", status);
  setCookie("artisan_name", name);
  setCookie("artisan_initials", initials);
}

async function resolveArtisanStatus(token: string, fallbackName: string): Promise<{
  status: ArtisanAuthStatus;
  name: string;
  initials: string;
}> {
  const res = await api.get("/artisans/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
  const profile = unwrapApi<ArtisanProfile>(res);
  const kyc = profile.kycStatus?.toUpperCase();
  const status: ArtisanAuthStatus = kyc === "APPROVED" ? "approved" : "pending";
  const name = `${profile.firstName} ${profile.lastName}`.trim() || fallbackName;
  const initials = `${profile.firstName?.[0] ?? ""}${profile.lastName?.[0] ?? ""}`.toUpperCase();
  return { status, name, initials };
}

export const artisanAuth = {
  async login(credentials: { phone: string; password: string }): Promise<ArtisanLoginResult> {
    try {
      const phone = toMoroccanPhone(credentials.phone);
      const res = await api.post("/auth/login", { phone, password: credentials.password });
      const session = unwrapApi<{
        accessToken: string;
        user: { role: string; firstName?: string; lastName?: string };
      }>(res);

      if (session.user.role !== "ARTISAN") {
        return { success: false, error: "Ce compte n'est pas un compte artisan" };
      }

      const fallbackName = `${session.user.firstName ?? ""} ${session.user.lastName ?? ""}`.trim();
      let status: ArtisanAuthStatus = "pending";
      let name = fallbackName || "Artisan";
      let initials = `${session.user.firstName?.[0] ?? "A"}${session.user.lastName?.[0] ?? ""}`.toUpperCase();

      try {
        const resolved = await resolveArtisanStatus(session.accessToken, name);
        status = resolved.status;
        name = resolved.name;
        initials = resolved.initials;
      } catch {
        status = "pending";
      }

      persistSession(session.accessToken, status, name, initials);
      return { success: true, status };
    } catch {
      return { success: false, error: "Numéro ou mot de passe incorrect" };
    }
  },

  logout() {
    setAccessToken(null);
    clearCookie("artisan_token");
    clearCookie("artisan_status");
    clearCookie("artisan_name");
    clearCookie("artisan_initials");
  },

  async register(data: ArtisanRegisterData): Promise<ArtisanLoginResult> {
    try {
      const phone = toMoroccanPhone(data.phone);
      await api.post("/auth/register/artisan", {
        firstName: data.firstName,
        lastName: data.lastName,
        phone,
        email: data.email || `${phone.replace(/\D/g, "")}@pending.depanni.ma`,
        password: data.password,
        city: data.ville,
        specialties: data.services,
        serviceRadiusKm: data.radiusKm,
      });
      const initials = `${data.firstName[0] ?? ""}${data.lastName[0] ?? ""}`.toUpperCase();
      setCookie("artisan_status", "pending");
      setCookie("artisan_name", `${data.firstName} ${data.lastName}`);
      setCookie("artisan_initials", initials);
      setCookie("artisan_token", "pending_verify");
      return { success: true, status: "pending" };
    } catch {
      return { success: false, error: "Inscription impossible. Vérifiez les informations." };
    }
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
