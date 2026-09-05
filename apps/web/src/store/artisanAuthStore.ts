"use client";

import { create } from "zustand";

import { artisanAuth, getArtisanCookie } from "@/lib/artisanAuth";
import { setAccessToken } from "@/lib/token";

interface ArtisanAuthState {
  token: string | null;
  status: "approved" | "pending" | null;
  name: string | null;
  initials: string | null;
  hydrated: boolean;
  hydrate: () => void;
  syncFromCookies: () => void;
  clear: () => void;
}

export const useArtisanAuthStore = create<ArtisanAuthState>((set) => ({
  token: null,
  status: null,
  name: null,
  initials: null,
  hydrated: false,
  hydrate: () => {
    const token = getArtisanCookie("artisan_token") ?? null;
    if (token && token !== "pending_verify") setAccessToken(token);
    set({
      token,
      status: (getArtisanCookie("artisan_status") as "approved" | "pending") ?? null,
      name: getArtisanCookie("artisan_name") ?? null,
      initials: getArtisanCookie("artisan_initials") ?? "A",
      hydrated: true,
    });
  },
  syncFromCookies: () => {
    const token = getArtisanCookie("artisan_token") ?? null;
    if (token && token !== "pending_verify") setAccessToken(token);
    set({
      token,
      status: (getArtisanCookie("artisan_status") as "approved" | "pending") ?? null,
      name: getArtisanCookie("artisan_name") ?? null,
      initials: getArtisanCookie("artisan_initials") ?? null,
    });
  },
  clear: () => {
    artisanAuth.logout();
    set({ token: null, status: null, name: null, initials: null });
  },
}));
