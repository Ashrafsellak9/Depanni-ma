"use client";

import { Info, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export const FIELD_LABEL =
  "mb-2 block text-[11px] font-semibold uppercase tracking-wider text-[#0F1E35]";
export const FIELD_INPUT =
  "w-full rounded-xl border border-[#E5E0D8] bg-[#FAF7F2] px-4 py-2.5 text-[13px] text-[#0F1E35] outline-none transition-all focus:border-[#0F1E35]";

export function SettingsCard({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: LucideIcon;
  children: ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#E5E0D8] bg-white">
      <div className="flex items-center gap-2.5 border-b border-[#E5E0D8] px-5 py-4">
        <Icon size={15} className="text-[#F05A1A]" />
        <h3 className="text-[14px] font-semibold text-[#0F1E35]">{title}</h3>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

export function Field({
  label,
  defaultValue,
  type = "text",
  placeholder,
  hint,
  onChange,
}: {
  label: string;
  defaultValue?: string;
  type?: string;
  placeholder?: string;
  hint?: string;
  onChange?: () => void;
}) {
  return (
    <div>
      <label className={FIELD_LABEL}>{label}</label>
      <input
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        onChange={onChange}
        className={FIELD_INPUT}
      />
      {hint && <p className="mt-1 text-[10px] text-[#9CA3AF]">{hint}</p>}
    </div>
  );
}

export function FieldNumber({
  label,
  defaultValue,
  hint,
  onChange,
}: {
  label: string;
  defaultValue: number;
  hint?: string;
  onChange?: () => void;
}) {
  return (
    <div>
      <label className={FIELD_LABEL}>{label}</label>
      <input
        type="number"
        defaultValue={defaultValue}
        onChange={onChange}
        className={FIELD_INPUT}
      />
      {hint && <p className="mt-1 text-[10px] text-[#9CA3AF]">{hint}</p>}
    </div>
  );
}

export function Toggle({
  value,
  onChange,
  danger = false,
  size = "md",
}: {
  value: boolean;
  onChange: (v: boolean) => void;
  danger?: boolean;
  size?: "sm" | "md";
}) {
  const w = size === "sm" ? "w-10 h-5" : "w-12 h-6";
  const dot = size === "sm" ? "w-4 h-4" : "w-5 h-5";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      onClick={() => onChange(!value)}
      className={`relative flex-shrink-0 rounded-full transition-all ${w} ${
        value ? (danger ? "bg-[#DC2626]" : "bg-[#1B8A4E]") : "bg-[#E5E0D8]"
      }`}
    >
      <div
        className={`absolute top-0.5 rounded-full bg-white shadow transition-all ${dot} ${
          value ? "right-0.5" : "left-0.5"
        }`}
      />
    </button>
  );
}

export function InfoBox({ children }: { children: ReactNode }) {
  return (
    <div className="mt-4 flex items-start gap-2 rounded-xl border border-[rgba(15,30,53,0.08)] bg-[rgba(15,30,53,0.04)] px-4 py-3">
      <Info size={13} className="mt-0.5 flex-shrink-0 text-[#6B7280]" />
      <span className="text-[11px] leading-[1.6] text-[#6B7280]">{children}</span>
    </div>
  );
}

export function SelectField({
  label,
  defaultValue,
  options,
  onChange,
}: {
  label: string;
  defaultValue?: string;
  options: string[];
  onChange?: () => void;
}) {
  return (
    <div>
      <label className={FIELD_LABEL}>{label}</label>
      <select defaultValue={defaultValue} onChange={onChange} className={`${FIELD_INPUT} cursor-pointer`}>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

export type SettingsSectionProps = {
  markChanged: () => void;
};
