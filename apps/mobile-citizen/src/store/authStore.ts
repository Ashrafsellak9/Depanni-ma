import { create } from "zustand";

import { api, getApiErrorMessage, unwrapApi } from "@/src/lib/api";
import type { AuthSession, AuthUserView } from "@/src/lib/api-types";
import { clearTokens, getAccessToken, getRefreshToken, setTokens } from "@/src/lib/tokens";
import * as authService from "@/src/services/auth";

interface AuthState {
  user: AuthUserView | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  pendingPhone: string | null;
  hydrate: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: authService.RegisterPayload) => Promise<void>;
  verifyOtp: (code: string, purpose?: "REGISTER" | "VERIFY_PHONE") => Promise<void>;
  logout: () => Promise<void>;
  setPendingPhone: (phone: string | null) => void;
}

async function persistSession(session: AuthSession): Promise<void> {
  await setTokens(session.accessToken, session.refreshToken);
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  pendingPhone: null,

  hydrate: async () => {
    set({ isLoading: true });
    try {
      const accessToken = await getAccessToken();
      if (!accessToken) {
        set({ user: null, isAuthenticated: false, isLoading: false });
        return;
      }
      const { data } = await api.get("/auth/me");
      const user = unwrapApi<AuthUserView>({ data });
      set({ user, isAuthenticated: true, isLoading: false });
    } catch {
      const refreshToken = await getRefreshToken();
      if (refreshToken) {
        try {
          const session = await authService.refresh(refreshToken);
          await persistSession(session);
          set({ user: session.user, isAuthenticated: true, isLoading: false });
          return;
        } catch {
          // fall through
        }
      }
      await clearTokens();
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  login: async (email, password) => {
    const session = await authService.login(email, password);
    await persistSession(session);
    set({ user: session.user, isAuthenticated: true, pendingPhone: null });
  },

  register: async (payload) => {
    const result = await authService.registerCitizen(payload);
    set({ pendingPhone: result.phone });
  },

  verifyOtp: async (code, purpose = "REGISTER") => {
    const phone = get().pendingPhone;
    if (!phone) {
      throw new Error("Numéro de téléphone manquant. Recommencez l'inscription.");
    }
    const session = await authService.verifyOtp({ phone, code, purpose });
    await persistSession(session);
    set({
      user: session.user,
      isAuthenticated: true,
      pendingPhone: null,
    });
  },

  logout: async () => {
    try {
      const refreshToken = await getRefreshToken();
      if (refreshToken) {
        await api.post("/auth/logout", { refreshToken });
      }
    } catch {
      // ignore
    } finally {
      await clearTokens();
      set({ user: null, isAuthenticated: false, pendingPhone: null });
    }
  },

  setPendingPhone: (phone) => set({ pendingPhone: phone }),
}));
