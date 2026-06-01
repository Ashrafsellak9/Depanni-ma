"use client";

import { Send, Trash2, Users } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

import { ADMIN_TEAM } from "@/components/admin/parametres/adminParametresMock";
import {
  FIELD_INPUT,
  FIELD_LABEL,
  Field,
  SettingsCard,
  type SettingsSectionProps,
} from "@/components/admin/parametres/settingsUi";

function roleBadgeClass(role: string): string {
  if (role === "Super Admin") return "bg-[rgba(240,90,26,0.1)] text-[#F05A1A]";
  if (role === "Finance") return "bg-[rgba(27,138,78,0.1)] text-[#1B8A4E]";
  return "bg-[rgba(107,114,128,0.1)] text-[#6B7280]";
}

export function AdminsSection({ markChanged }: SettingsSectionProps) {
  const [admins, setAdmins] = useState(ADMIN_TEAM);

  const removeAdmin = (email: string) => {
    setAdmins((prev) => prev.filter((a) => a.email !== email));
    markChanged();
    toast.success("Administrateur retiré");
  };

  const handleInvite = () => {
    markChanged();
    toast.success("Invitation envoyée");
  };

  return (
    <SettingsCard title="Administrateurs" icon={Users}>
      <div className="mb-5 space-y-2">
        {admins.map((admin) => (
          <div
            key={admin.email}
            className="flex items-center gap-3 rounded-xl border border-[#E5E0D8] bg-[#FAF7F2] p-3"
          >
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl text-[12px] font-bold text-white"
              style={{ background: admin.color }}
            >
              {admin.initials}
            </div>
            <div className="flex-1">
              <div className="text-[13px] font-semibold text-[#0F1E35]">{admin.name}</div>
              <div className="text-[10px] text-[#6B7280]">
                {admin.email} · Connexion : {admin.lastLogin}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`rounded-full px-2 py-1 text-[10px] font-semibold ${roleBadgeClass(admin.role)}`}
              >
                {admin.role}
              </span>
              {admin.role !== "Super Admin" && (
                <button
                  type="button"
                  onClick={() => removeAdmin(admin.email)}
                  className="flex h-7 w-7 items-center justify-center rounded-lg bg-[rgba(220,38,38,0.07)] text-[#DC2626] hover:bg-[rgba(220,38,38,0.12)]"
                >
                  <Trash2 size={12} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-[#E5E0D8] pt-4">
        <div className="mb-3 text-[12px] font-semibold text-[#0F1E35]">
          Inviter un administrateur
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Field label="Email" placeholder="email@depanni.ma" onChange={markChanged} />
          <div>
            <label className={FIELD_LABEL}>Rôle</label>
            <select className={`${FIELD_INPUT} cursor-pointer`} onChange={markChanged}>
              <option>Modérateur</option>
              <option>Finance</option>
              <option>Support</option>
              <option>Super Admin</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              type="button"
              onClick={handleInvite}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0F1E35] py-2.5 text-[13px] font-semibold text-white"
            >
              <Send size={13} />
              Inviter
            </button>
          </div>
        </div>
      </div>
    </SettingsCard>
  );
}
