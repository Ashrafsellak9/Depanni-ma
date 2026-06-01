"use client";

import { BadgeCheck, Key, Lock } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

import { KYC_POLICIES, SECURITY_TOGGLES } from "@/components/admin/parametres/adminParametresMock";
import {
  Field,
  FieldNumber,
  SettingsCard,
  Toggle,
  type SettingsSectionProps,
} from "@/components/admin/parametres/settingsUi";

export function SecuriteSection({ markChanged }: SettingsSectionProps) {
  const [security, setSecurity] = useState(SECURITY_TOGGLES);
  const [kyc, setKyc] = useState(KYC_POLICIES);

  const toggleSecurity = (index: number) => {
    setSecurity((prev) =>
      prev.map((s, i) => (i === index ? { ...s, active: !s.active } : s)),
    );
    markChanged();
  };

  const toggleKyc = (index: number) => {
    setKyc((prev) =>
      prev.map((s, i) => (i === index ? { ...s, active: !s.active } : s)),
    );
    markChanged();
  };

  return (
    <div className="space-y-5">
      <SettingsCard title="Authentification" icon={Lock}>
        <div className="space-y-3">
          {security.map((s, i) => (
            <div
              key={s.label}
              className="flex items-center justify-between border-b border-[rgba(229,224,216,0.5)] py-3 last:border-0"
            >
              <span className="text-[13px] text-[#0F1E35]">{s.label}</span>
              <Toggle value={s.active} onChange={() => toggleSecurity(i)} size="sm" />
            </div>
          ))}
        </div>
      </SettingsCard>

      <SettingsCard title="Politique KYC" icon={BadgeCheck}>
        <div className="mb-4 space-y-3">
          {kyc.map((s, i) => (
            <div
              key={s.label}
              className="flex items-center justify-between border-b border-[rgba(229,224,216,0.5)] py-3 last:border-0"
            >
              <span className="text-[13px] text-[#0F1E35]">{s.label}</span>
              <Toggle value={s.active} onChange={() => toggleKyc(i)} size="sm" />
            </div>
          ))}
        </div>
        <FieldNumber
          label="Score minimum pour badge Top Artisan"
          defaultValue={4.7}
          onChange={markChanged}
        />
      </SettingsCard>

      <SettingsCard title="Changer mot de passe admin" icon={Key}>
        <div className="grid max-w-[400px] grid-cols-1 gap-3">
          <Field label="Mot de passe actuel" type="password" placeholder="••••••••" onChange={markChanged} />
          <Field label="Nouveau mot de passe" type="password" placeholder="••••••••" onChange={markChanged} />
          <Field label="Confirmer" type="password" placeholder="••••••••" onChange={markChanged} />
          <button
            type="button"
            onClick={() => {
              markChanged();
              toast.success("Mot de passe mis à jour");
            }}
            className="mt-2 rounded-xl bg-[#0F1E35] py-3 text-[13px] font-semibold text-white"
          >
            Mettre à jour
          </button>
        </div>
      </SettingsCard>
    </div>
  );
}
