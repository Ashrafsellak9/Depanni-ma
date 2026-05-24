import { create } from "zustand";

import { api, bindAuthRefresh, unwrapApi } from "@/src/lib/api";
import type { AuthSession, AuthUserView } from "@/src/lib/api-types";
import { clearAccessToken, setAccessToken } from "@/src/lib/session";
import { clearRefreshToken, getRefreshToken, setRefreshToken } from "@/src/lib/tokens";
import * as authService from "@/src/services/auth";
import { syncPushTokenIfAuthenticated } from "@/src/services/notifications";

interface AuthState {
  user: AuthUserView | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  pendingPhone: string | null;
  otpPurpose: "REGISTER" | "RESET" | "VERIFY_PHONE";
  hydrate: () => Promise<void>;
  applySession: (session: AuthSession) => Promise<void>;
  login: (payload: authService.LoginPayload) => Promise<void>;
  register: (payload: authService.RegisterPayload) => Promise<void>;
  verifyOtp: (code: string, purpose?: "REGISTER" | "RESET" | "VERIFY_PHONE") => Promise<void>;
  resendOtp: () => Promise<void>;
  refresh: () => Promise<string>;
  logout: () => Promise<void>;
  setPendingPhone: (phone: string | null, purpose?: AuthState["otpPurpose"]) => void;
}

async function persistSession(session: AuthSession): Promise<void> {
  setAccessToken(session.accessToken);
  if (session.refreshToken) {
    await setRefreshToken(session.refreshToken);
  }
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  pendingPhone: null,
  otpPurpose: "REGISTER",

  applySession: async (session) => {
    await persistSession(session);
    set({
      user: session.user,
      isAuthenticated: true,
      pendingPhone: null,
    });
    await syncPushTokenIfAuthenticated();
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
      set({ user, isAuthenticated: true, isLoading: false });
    } catch {
      await clearRefreshToken();
      clearAccessToken();
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  refresh: async () => {
    const refreshToken = await getRefreshToken();
    if (!refreshToken) {
      throw new Error("Session expirée");
    }
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
    const result = await authService.registerCitizen(payload);
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
      if (refreshToken) {
        await authService.logoutRemote(refreshToken);
      }
    } catch {
      // ignore
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

  setPendingPhone: (phone, purpose = "REGISTER") =>
    set({ pendingPhone: phone, otpPurpose: purpose }),
}));

bindAuthRefresh(async () => {
  try {
    return await useAuthStore.getState().refresh();
  } catch {
    await useAuthStore.getState().logout();
    return null;
  }
});
