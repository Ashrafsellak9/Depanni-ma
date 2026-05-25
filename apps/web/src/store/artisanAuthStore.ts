"use client";

import { create } from "zustand";

import { artisanAuth, getArtisanCookie } from "@/lib/artisanAuth";

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
    set({
      token: getArtisanCookie("artisan_token") ?? null,
      status: (getArtisanCookie("artisan_status") as "approved" | "pending") ?? null,
      name: getArtisanCookie("artisan_name") ?? null,
      initials: getArtisanCookie("artisan_initials") ?? "KA",
      hydrated: true,
    });
  },
  syncFromCookies: () => {
    set({
      token: getArtisanCookie("artisan_token") ?? null,
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
