"use client";

import { CreditCard, Percent, Zap } from "lucide-react";
import { useState } from "react";

import { COMMISSION_PLANS } from "@/components/admin/parametres/adminParametresMock";
import {
  FieldNumber,
  InfoBox,
  SettingsCard,
  Toggle,
  type SettingsSectionProps,
} from "@/components/admin/parametres/settingsUi";

export function CommissionsSection({ markChanged }: SettingsSectionProps) {
  const [rates, setRates] = useState(COMMISSION_PLANS.map((p) => p.rate));
  const [autoMajoration, setAutoMajoration] = useState(true);

  const updateRate = (index: number, value: number) => {
    setRates((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
    markChanged();
  };

  return (
    <div className="space-y-5">
      <SettingsCard title="Taux de commission par plan" icon={Percent}>
        <div className="space-y-4">
          {COMMISSION_PLANS.map((p, i) => (
            <div
              key={p.plan}
              className="flex items-center gap-4 rounded-xl border border-[#E5E0D8] bg-[#FAF7F2] p-4"
            >
              <div
                className="h-10 w-2 flex-shrink-0 rounded-full"
                style={{ background: p.color }}
              />
              <div className="flex-1">
                <div className="mb-0.5 text-[13px] font-semibold text-[#0F1E35]">{p.plan}</div>
                <div className="text-[11px] text-[#6B7280]">
                  {p.desc} · {p.artisans} artisans actifs
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={rates[i]}
                  min={0}
                  max={30}
                  onChange={(e) => updateRate(i, Number(e.target.value))}
                  className="w-16 rounded-lg border border-[#E5E0D8] bg-white px-3 py-2 text-center text-[14px] font-bold text-[#0F1E35] outline-none focus:border-[#F05A1A]"
                />
                <span className="text-[13px] font-medium text-[#6B7280]">%</span>
              </div>
            </div>
          ))}
        </div>
        <InfoBox>
          Modifier les taux de commission affecte les nouvelles missions uniquement. Les missions en
          cours conservent le taux actuel.
        </InfoBox>
      </SettingsCard>

      <SettingsCard title="Prix des abonnements (MAD/mois)" icon={CreditCard}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FieldNumber label="Prix Premium" defaultValue={150} onChange={markChanged} />
          <FieldNumber label="Prix Pro" defaultValue={350} onChange={markChanged} />
          <FieldNumber label="Période d'essai gratuit (jours)" defaultValue={30} onChange={markChanged} />
          <FieldNumber label="Pénalité annulation mission" defaultValue={50} onChange={markChanged} />
        </div>
      </SettingsCard>

      <SettingsCard title="Majoration urgences & horaires" icon={Zap}>
        <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FieldNumber
            label="Majoration missions nocturnes (%)"
            defaultValue={20}
            hint="22h–7h"
            onChange={markChanged}
          />
          <FieldNumber label="Majoration week-end (%)" defaultValue={10} onChange={markChanged} />
          <FieldNumber
            label="Commission réduite urgence (artisan)"
            defaultValue={5}
            hint="Réduction accordée à l'artisan qui répond en <3 min"
            onChange={markChanged}
          />
        </div>
        <div className="flex items-center justify-between rounded-xl border border-[#E5E0D8] bg-[#FAF7F2] p-3">
          <div>
            <div className="text-[13px] font-medium text-[#0F1E35]">
              Activer la majoration automatique
            </div>
            <div className="text-[11px] text-[#6B7280]">
              Applique automatiquement les majorations selon l&apos;heure
            </div>
          </div>
          <Toggle
            value={autoMajoration}
            onChange={(v) => {
              setAutoMajoration(v);
              markChanged();
            }}
          />
        </div>
      </SettingsCard>
    </div>
  );
}
