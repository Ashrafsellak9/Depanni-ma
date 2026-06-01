"use client";

import { Bell, Mail } from "lucide-react";
import { useState } from "react";

import { NOTIFICATION_RULES } from "@/components/admin/parametres/adminParametresMock";
import {
  Field,
  SettingsCard,
  Toggle,
  type SettingsSectionProps,
} from "@/components/admin/parametres/settingsUi";

export function NotificationsSection({ markChanged }: SettingsSectionProps) {
  const [rules, setRules] = useState(NOTIFICATION_RULES);

  const toggleRule = (index: number) => {
    setRules((prev) =>
      prev.map((r, i) => (i === index ? { ...r, active: !r.active } : r)),
    );
    markChanged();
  };

  return (
    <div className="space-y-5">
      <SettingsCard title="Notifications système" icon={Bell}>
        <div className="space-y-3">
          {rules.map((n, i) => (
            <div
              key={n.label}
              className="flex items-center justify-between border-b border-[rgba(229,224,216,0.5)] py-3 last:border-0"
            >
              <div>
                <div className="text-[13px] font-medium text-[#0F1E35]">{n.label}</div>
                <div className="mt-0.5 flex items-center gap-1 text-[11px] text-[#6B7280]">
                  <Bell size={10} />
                  {n.channel}
                </div>
              </div>
              <Toggle value={n.active} onChange={() => toggleRule(i)} size="sm" />
            </div>
          ))}
        </div>
      </SettingsCard>

      <SettingsCard title="Configuration envoi" icon={Mail}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Provider SMS" defaultValue="Twilio" onChange={markChanged} />
          <Field label="Email expéditeur" defaultValue="no-reply@depanni.ma" onChange={markChanged} />
          <Field label="Provider Email" defaultValue="SendGrid" onChange={markChanged} />
          <Field
            label="Numéro WhatsApp Business"
            defaultValue="+212 5 22 XX XX XX"
            onChange={markChanged}
          />
        </div>
      </SettingsCard>
    </div>
  );
}
