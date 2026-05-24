"use client";

import { Clock, Calendar, Zap } from "lucide-react";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { JobCreateWizardInput } from "@depanni/validators";

type Urgency = JobCreateWizardInput["urgency"];

const OPTIONS: {
  value: Urgency;
  label: string;
  description: string;
  icon: typeof Zap;
}[] = [
  { value: "NOW", label: "Maintenant", description: "Intervention urgente", icon: Zap },
  { value: "IN2H", label: "Dans 2 h", description: "Sous 2 heures", icon: Clock },
  { value: "SCHEDULED", label: "Planifié", description: "Choisir date & heure", icon: Calendar },
];

interface UrgencySelectorProps {
  urgency: Urgency;
  scheduledAt?: string;
  budgetMin?: number;
  budgetMax?: number;
  onUrgencyChange: (u: Urgency) => void;
  onScheduledAtChange: (iso: string | undefined) => void;
  onBudgetChange: (min?: number, max?: number) => void;
  errors?: { urgency?: string; scheduledAt?: string; budgetMax?: string };
}

export function UrgencySelector({
  urgency,
  scheduledAt,
  budgetMin = 100,
  budgetMax = 500,
  onUrgencyChange,
  onScheduledAtChange,
  onBudgetChange,
  errors,
}: UrgencySelectorProps) {
  const scheduledLocal = scheduledAt
    ? new Date(scheduledAt).toISOString().slice(0, 16)
    : "";

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-3">
        {OPTIONS.map((opt) => {
          const Icon = opt.icon;
          const selected = urgency === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onUrgencyChange(opt.value)}
              className={cn(
                "flex flex-col items-start gap-2 rounded-xl border-2 p-4 text-left transition-all",
                selected
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-border hover:border-primary/30",
              )}
            >
              <Icon className={cn("h-6 w-6", selected ? "text-primary" : "text-muted-foreground")} />
              <span className="font-semibold text-navy">{opt.label}</span>
              <span className="text-xs text-muted-foreground">{opt.description}</span>
            </button>
          );
        })}
      </div>
      {errors?.urgency && <p className="text-sm text-danger">{errors.urgency}</p>}

      {urgency === "SCHEDULED" && (
        <div className="space-y-2">
          <Label htmlFor="scheduledAt">Date et heure souhaitées</Label>
          <input
            id="scheduledAt"
            type="datetime-local"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            value={scheduledLocal}
            min={new Date().toISOString().slice(0, 16)}
            onChange={(e) => {
              const v = e.target.value;
              onScheduledAtChange(v ? new Date(v).toISOString() : undefined);
            }}
          />
          {errors?.scheduledAt && (
            <p className="text-sm text-danger">{errors.scheduledAt}</p>
          )}
        </div>
      )}

      <div className="space-y-4 rounded-xl border bg-card p-4">
        <p className="font-medium text-navy">Budget indicatif (MAD)</p>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Min: {budgetMin} MAD</span>
            <span>Max: {budgetMax} MAD</span>
          </div>
          <input
            type="range"
            min={50}
            max={2000}
            step={50}
            value={budgetMin}
            className="w-full accent-primary"
            onChange={(e) => onBudgetChange(Number(e.target.value), budgetMax)}
          />
          <input
            type="range"
            min={50}
            max={5000}
            step={50}
            value={budgetMax}
            className="w-full accent-navy"
            onChange={(e) => onBudgetChange(budgetMin, Number(e.target.value))}
          />
        </div>
        {errors?.budgetMax && <p className="text-sm text-danger">{errors.budgetMax}</p>}
      </div>
    </div>
  );
}
