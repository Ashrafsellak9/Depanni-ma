"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Clock, Globe } from "lucide-react";
import { useState } from "react";

import {
  Field,
  FieldNumber,
  SelectField,
  SettingsCard,
  Toggle,
  type SettingsSectionProps,
} from "@/components/admin/parametres/settingsUi";

export function GeneralSection({ markChanged }: SettingsSectionProps) {
  const [maintenance, setMaintenance] = useState(false);

  const handleMaintenance = (v: boolean) => {
    setMaintenance(v);
    markChanged();
  };

  return (
    <div className="space-y-5">
      <SettingsCard title="Informations plateforme" icon={Globe}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Nom de la plateforme" defaultValue="DEPANNI.ma" onChange={markChanged} />
          <Field label="Domaine" defaultValue="depanni.ma" onChange={markChanged} />
          <Field label="Email support" defaultValue="support@depanni.ma" onChange={markChanged} />
          <Field label="Téléphone support" defaultValue="05 22 XX XX XX" onChange={markChanged} />
          <Field label="Ville de lancement" defaultValue="El Jadida" onChange={markChanged} />
          <Field label="Pays" defaultValue="Maroc 🇲🇦" onChange={markChanged} />
        </div>
      </SettingsCard>

      <SettingsCard title="Mode maintenance" icon={AlertTriangle}>
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="mb-0.5 text-[13px] font-medium text-[#0F1E35]">
              Activer le mode maintenance
            </div>
            <div className="text-[12px] text-[#6B7280]">
              L&apos;app sera inaccessible pour les clients et artisans. Seul l&apos;admin peut
              accéder.
            </div>
          </div>
          <Toggle value={maintenance} onChange={handleMaintenance} danger />
        </div>
        {maintenance && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-4 rounded-xl border border-[rgba(220,38,38,0.2)] bg-[rgba(220,38,38,0.06)] p-3"
          >
            <Field
              label="Message affiché aux utilisateurs"
              defaultValue="Maintenance en cours. Retour prévu dans 2h."
              onChange={markChanged}
            />
          </motion.div>
        )}
      </SettingsCard>

      <SettingsCard title="Délais & Timeouts" icon={Clock}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FieldNumber
            label="Timeout offre artisan (secondes)"
            defaultValue={180}
            hint="Durée avant expiration d'une alerte mission"
            onChange={markChanged}
          />
          <FieldNumber label="Rayon initial alertes (km)" defaultValue={2} onChange={markChanged} />
          <FieldNumber label="Rayon max alertes (km)" defaultValue={10} onChange={markChanged} />
          <FieldNumber label="Max offres par demande" defaultValue={10} onChange={markChanged} />
          <FieldNumber
            label="Délai auto-validation paiement (h)"
            defaultValue={24}
            hint="Si client ne valide pas, paiement libéré auto"
            onChange={markChanged}
          />
          <FieldNumber label="Délai virement artisan (h)" defaultValue={24} onChange={markChanged} />
        </div>
      </SettingsCard>

      <SettingsCard title="Langues & Localisation" icon={Globe}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <SelectField
            label="Langue principale"
            defaultValue="Français"
            options={["Français", "Arabe (Darija)", "Bilingue FR/AR"]}
            onChange={markChanged}
          />
          <SelectField
            label="Devise"
            defaultValue="MAD (Dirham marocain)"
            options={["MAD (Dirham marocain)"]}
            onChange={markChanged}
          />
          <SelectField
            label="Format date"
            defaultValue="DD/MM/YYYY"
            options={["DD/MM/YYYY", "MM/DD/YYYY"]}
            onChange={markChanged}
          />
          <SelectField
            label="Fuseau horaire"
            defaultValue="Africa/Casablanca (UTC+1)"
            options={["Africa/Casablanca (UTC+1)"]}
            onChange={markChanged}
          />
        </div>
      </SettingsCard>
    </div>
  );
}
