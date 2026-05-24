import type { JobCreateWizardInput } from "@depanni/validators";

const DRAFT_KEY = "depanni:request-wizard-draft";

export interface RequestWizardDraft {
  step: number;
  values: Partial<JobCreateWizardInput>;
  updatedAt: string;
}

export function loadRequestDraft(): RequestWizardDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as RequestWizardDraft;
  } catch {
    return null;
  }
}

export function saveRequestDraft(step: number, values: Partial<JobCreateWizardInput>): void {
  if (typeof window === "undefined") return;
  const draft: RequestWizardDraft = {
    step,
    values,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
}

export function clearRequestDraft(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(DRAFT_KEY);
}
