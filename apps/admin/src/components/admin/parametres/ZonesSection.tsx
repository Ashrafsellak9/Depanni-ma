"use client";

import { MapPin, Navigation, Plus, Wrench } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

import {
  DEPLOYMENT_CITIES,
  SERVICES,
} from "@/components/admin/parametres/adminParametresMock";
import {
  FieldNumber,
  SettingsCard,
  Toggle,
  type SettingsSectionProps,
} from "@/components/admin/parametres/settingsUi";

export function ZonesSection({ markChanged }: SettingsSectionProps) {
  const [cities, setCities] = useState(DEPLOYMENT_CITIES);
  const [services, setServices] = useState(SERVICES);

  const toggleCity = (index: number) => {
    setCities((prev) =>
      prev.map((c, i) =>
        i === index
          ? {
              ...c,
              status: c.status === "active" ? ("coming" as const) : ("active" as const),
              artisans: c.status === "active" ? 0 : c.artisans || 53,
            }
          : c,
      ),
    );
    markChanged();
  };

  const toggleService = (index: number) => {
    setServices((prev) =>
      prev.map((s, i) => (i === index ? { ...s, active: !s.active } : s)),
    );
    markChanged();
  };

  return (
    <div className="space-y-5">
      <SettingsCard title="Villes de déploiement" icon={MapPin}>
        <div className="mb-4 space-y-2">
          {cities.map((v, i) => (
            <div
              key={v.ville}
              className="flex items-center justify-between rounded-xl border border-[#E5E0D8] bg-[#FAF7F2] p-3"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`h-2 w-2 rounded-full ${
                    v.status === "active"
                      ? "animate-pulse bg-[#1B8A4E]"
                      : v.status === "coming"
                        ? "bg-[#F05A1A]"
                        : "bg-[#9CA3AF]"
                  }`}
                />
                <div>
                  <div className="text-[13px] font-medium text-[#0F1E35]">{v.ville}</div>
                  <div className="text-[10px] text-[#6B7280]">
                    {v.artisans > 0 ? `${v.artisans} artisans` : v.label}
                  </div>
                </div>
              </div>
              <Toggle
                value={v.status === "active"}
                onChange={() => toggleCity(i)}
                size="sm"
              />
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => toast.success("Ajout de ville — bientôt disponible")}
          className="flex items-center gap-2 text-[12px] font-semibold text-[#F05A1A] transition-colors hover:text-[#FF7A3D]"
        >
          <Plus size={13} />
          Ajouter une ville
        </button>
      </SettingsCard>

      <SettingsCard title="Services disponibles" icon={Wrench}>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {services.map((s, i) => (
            <div
              key={s.name}
              className="flex items-center justify-between rounded-xl border border-[#E5E0D8] bg-[#FAF7F2] p-3"
            >
              <div className="flex items-center gap-2">
                <span className="text-[16px]">{s.emoji}</span>
                <span className="text-[12px] font-medium text-[#0F1E35]">{s.name}</span>
              </div>
              <Toggle value={s.active} onChange={() => toggleService(i)} size="sm" />
            </div>
          ))}
        </div>
      </SettingsCard>

      <SettingsCard title="Paramètres géolocalisation" icon={Navigation}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FieldNumber label="Rayon alerte initial (km)" defaultValue={2} onChange={markChanged} />
          <FieldNumber label="Rayon expansion 1 (km)" defaultValue={5} onChange={markChanged} />
          <FieldNumber label="Rayon expansion 2 (km)" defaultValue={10} onChange={markChanged} />
          <FieldNumber label="Délai expansion (min)" defaultValue={10} onChange={markChanged} />
        </div>
      </SettingsCard>
    </div>
  );
}
