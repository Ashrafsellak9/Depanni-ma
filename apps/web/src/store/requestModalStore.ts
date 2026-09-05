"use client";

import { create } from "zustand";

export type RequestStep = 1 | 2 | 3 | 4;
export type RequestUrgency = "asap" | "schedule";

export type RequestDraft = {
  service: string | null;
  description: string;
  district: string;
  address: string;
  urgency: RequestUrgency;
  scheduledAt: string;
  firstName: string;
  phone: string;
  email: string;
  cgu: boolean;
};

const EMPTY_DRAFT: RequestDraft = {
  service: null,
  description: "",
  district: "",
  address: "",
  urgency: "asap",
  scheduledAt: "",
  firstName: "",
  phone: "",
  email: "",
  cgu: false,
};

let lastTrigger: HTMLElement | null = null;

function captureTrigger() {
  if (typeof document === "undefined") return;
  const el = document.activeElement;
  lastTrigger = el instanceof HTMLElement ? el : null;
}

function restoreTrigger() {
  const el = lastTrigger;
  lastTrigger = null;
  if (el) requestAnimationFrame(() => el.focus());
}

type RequestModalState = {
  open: boolean;
  step: RequestStep;
  draft: RequestDraft;
  submitting: boolean;
  error: string | null;
  openModal: (opts?: { service?: string }) => void;
  closeModal: () => void;
  setStep: (step: RequestStep) => void;
  patchDraft: (patch: Partial<RequestDraft>) => void;
  setSubmitting: (submitting: boolean) => void;
  setError: (error: string | null) => void;
};

export const useRequestModal = create<RequestModalState>((set) => ({
  open: false,
  step: 1,
  draft: EMPTY_DRAFT,
  submitting: false,
  error: null,
  openModal: (opts) => {
    captureTrigger();
    set({
      open: true,
      step: 1,
      submitting: false,
      error: null,
      draft: { ...EMPTY_DRAFT, service: opts?.service ?? null },
    });
  },
  closeModal: () => {
    set({ open: false, submitting: false, error: null });
    restoreTrigger();
  },
  setStep: (step) => set({ step, error: null }),
  patchDraft: (patch) => set((s) => ({ draft: { ...s.draft, ...patch } })),
  setSubmitting: (submitting) => set({ submitting }),
  setError: (error) => set({ error }),
}));
