import { create } from "zustand";

import { api, bindAuthRefresh, unwrapApi } from "@/src/lib/api";
import type { AuthSession, AuthUserView } from "@/src/lib/api-types";
import { clearAccessToken, setAccessToken } from "@/src/lib/session";
import { clearRefreshToken, getRefreshToken, setRefreshToken } from "@/src/lib/tokens";
import * as authService from "@/src/services/auth";

interface AuthState {
  user: AuthUserView | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  pendingPhone: string | null;
  otpPurpose: "REGISTER" | "RESET" | "VERIFY_PHONE";
  hydrate: () => Promise<void>;
  applySession: (session: AuthSession) => Promise<void>;
  login: (payload: authService.LoginPayload) => Promise<void>;
  register: (payload: authService.RegisterArtisanPayload) => Promise<void>;
  verifyOtp: (code: string, purpose?: AuthState["otpPurpose"]) => Promise<void>;
  resendOtp: () => Promise<void>;
  refresh: () => Promise<string>;
  logout: () => Promise<void>;
}

async function persistSession(session: AuthSession): Promise<void> {
  setAccessToken(session.accessToken);
  if (session.refreshToken) await setRefreshToken(session.refreshToken);
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  pendingPhone: null,
  otpPurpose: "REGISTER",

  applySession: async (session) => {
    if (session.user.role !== "ARTISAN") {
      throw new Error("Compte citoyen — utilisez l'app DEPANNI Citoyen");
    }
    await persistSession(session);
    set({ user: session.user, isAuthenticated: true, pendingPhone: null });
  },

  hydrate: async () => {
    set({ isLoading: true });
    try {
      const refreshToken = await getRefreshToken();
      if (!refreshToken) {
        set({ user: null, isAuthenticated: false, isLoading: false });
        return;
      }
      await get().refresh();
      const { data } = await api.get("/auth/me");
      const user = unwrapApi<AuthUserView>({ data });
      if (user.role !== "ARTISAN") {
        await get().logout();
        return;
      }
      set({ user, isAuthenticated: true, isLoading: false });
    } catch {
      await clearRefreshToken();
      clearAccessToken();
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  refresh: async () => {
    const refreshToken = await getRefreshToken();
    if (!refreshToken) throw new Error("Session expirée");
    const session = await authService.refreshSession(refreshToken);
    await persistSession(session);
    set({ user: session.user, isAuthenticated: true });
    return session.accessToken;
  },

  login: async (payload) => {
    const session = await authService.login(payload);
    await get().applySession(session);
  },

  register: async (payload) => {
    const result = await authService.registerArtisan(payload);
    set({ pendingPhone: result.phone, otpPurpose: "REGISTER" });
  },

  verifyOtp: async (code, purpose) => {
    const phone = get().pendingPhone;
    if (!phone) {
      throw new Error("Numéro manquant. Recommencez l'inscription.");
    }
    const session = await authService.verifyOtp({
      phone,
      code,
      purpose: purpose ?? get().otpPurpose,
    });
    await get().applySession(session);
  },

  resendOtp: async () => {
    const phone = get().pendingPhone;
    if (!phone) throw new Error("Numéro manquant");
    await authService.resendOtp({ phone, purpose: get().otpPurpose });
  },

  logout: async () => {
    try {
      const refreshToken = await getRefreshToken();
      if (refreshToken) await authService.logoutRemote(refreshToken);
    } catch {
      /* ignore */
    } finally {
      await clearRefreshToken();
      clearAccessToken();
      set({
        user: null,
        isAuthenticated: false,
        pendingPhone: null,
        otpPurpose: "REGISTER",
      });
    }
  },
}));

bindAuthRefresh(async () => {
  try {
    return await useAuthStore.getState().refresh();
  } catch {
    await useAuthStore.getState().logout();
    return null;
  }
});
