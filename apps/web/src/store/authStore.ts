"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import { setAccessToken } from "@/lib/token";
import type { AuthUser } from "@/types";

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  setSession: (user: AuthUser, accessToken: string) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      setSession: (user, accessToken) => {
        setAccessToken(accessToken);
        set({ user, accessToken });
      },
      clearSession: () => {
        setAccessToken(null);
        set({ user: null, accessToken: null });
      },
    }),
    {
      name: "depanni-auth",
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.accessToken) {
          setAccessToken(state.accessToken);
        }
      },
    },
  ),
);
