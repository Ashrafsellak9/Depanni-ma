"use client";

import { motion } from "framer-motion";
import {
  Bell,
  MapPin,
  Percent,
  Save,
  Settings,
  Shield,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import toast from "react-hot-toast";

import { AdminsSection } from "@/components/admin/parametres/AdminsSection";
import { CommissionsSection } from "@/components/admin/parametres/CommissionsSection";
import { GeneralSection } from "@/components/admin/parametres/GeneralSection";
import { NotificationsSection } from "@/components/admin/parametres/NotificationsSection";
import { SecuriteSection } from "@/components/admin/parametres/SecuriteSection";
import { ZonesSection } from "@/components/admin/parametres/ZonesSection";
import type { SettingsSectionId } from "@/components/admin/parametres/adminParametresMock";

const SECTIONS: { id: SettingsSectionId; label: string; icon: LucideIcon }[] = [
  { id: "general", label: "Général", icon: Settings },
  { id: "commissions", label: "Commissions", icon: Percent },
  { id: "zones", label: "Zones & Services", icon: MapPin },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "securite", label: "Sécurité", icon: Shield },
  { id: "admins", label: "Équipe Admin", icon: Users },
];

export function AdminParametresPage() {
  const [active, setActive] = useState<SettingsSectionId>("general");
  const [hasChanges, setHasChanges] = useState(false);

  const markChanged = useCallback(() => setHasChanges(true), []);

  const handleSave = () => {
    setHasChanges(false);
    toast.success("Paramètres sauvegardés");
  };

  const activeSection = useMemo(() => {
    switch (active) {
      case "general":
        return <GeneralSection markChanged={markChanged} />;
      case "commissions":
        return <CommissionsSection markChanged={markChanged} />;
      case "zones":
        return <ZonesSection markChanged={markChanged} />;
      case "notifications":
        return <NotificationsSection markChanged={markChanged} />;
      case "securite":
        return <SecuriteSection markChanged={markChanged} />;
      case "admins":
        return <AdminsSection markChanged={markChanged} />;
      default:
        return null;
    }
  }, [active, markChanged]);

  return (
    <>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[220px_1fr]">
        <div className="sticky top-[80px] h-fit rounded-2xl border border-[#E5E0D8] bg-white p-3">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setActive(s.id)}
              className={`mb-1 flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-[13px] font-medium transition-all last:mb-0 ${
                active === s.id
                  ? "bg-[rgba(240,90,26,0.08)] text-[#F05A1A]"
                  : "text-[#6B7280] hover:bg-[#FAF7F2] hover:text-[#0F1E35]"
              }`}
            >
              <s.icon size={15} className={active === s.id ? "text-[#F05A1A]" : ""} />
              {s.label}
            </button>
          ))}
        </div>

        <div>{activeSection}</div>
      </div>

      {hasChanges && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-4 rounded-2xl border border-[#E5E0D8] bg-white px-5 py-3 shadow-xl"
        >
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 animate-pulse rounded-full bg-[#F05A1A]" />
            <span className="text-[13px] font-medium text-[#0F1E35]">
              Modifications non sauvegardées
            </span>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setHasChanges(false)}
              className="rounded-xl border border-[#E5E0D8] bg-[#FAF7F2] px-4 py-2 text-[12px] font-medium text-[#6B7280]"
            >
              Annuler
            </button>
            <motion.button
              type="button"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={handleSave}
              className="flex items-center gap-2 rounded-xl bg-[#0F1E35] px-5 py-2 text-[12px] font-semibold text-white"
            >
              <Save size={13} />
              Sauvegarder
            </motion.button>
          </div>
        </motion.div>
      )}
    </>
  );
}
