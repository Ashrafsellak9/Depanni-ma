import { create } from "zustand";
import { persist } from "zustand/middleware";

import { setAccessToken } from "@/lib/token";
import type { AuthUser } from "@/types/admin";

interface AuthState {
  user: AuthUser | null;
  setSession: (user: AuthUser, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setSession: (user, token) => {
        setAccessToken(token);
        set({ user });
      },
      logout: () => {
        setAccessToken(null);
        set({ user: null });
      },
    }),
    { name: "depanni-admin-auth", partialize: (s) => ({ user: s.user }) },
  ),
);
