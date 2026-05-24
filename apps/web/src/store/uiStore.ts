"use client";

import { create } from "zustand";

interface UiState {
  sidebarOpen: boolean;
  locale: "fr" | "ar" | "en";
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setLocale: (locale: "fr" | "ar" | "en") => void;
}

export const useUiStore = create<UiState>((set) => ({
  sidebarOpen: true,
  locale: "fr",
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setLocale: (locale) => set({ locale }),
}));
