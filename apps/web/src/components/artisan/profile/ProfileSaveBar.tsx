"use client";

import { motion } from "framer-motion";
import { Save } from "lucide-react";

import type { ArtisanProfileForm } from "@/components/artisan/profile/useArtisanProfileForm";

interface ProfileSaveBarProps {
  form: ArtisanProfileForm;
  onSave: () => void;
}

export function ProfileSaveBar({ form, onSave }: ProfileSaveBarProps) {
  return (
    <div className="-mx-6 flex flex-wrap items-center justify-between gap-3 border-t border-dep-border bg-[#EDE8DF] px-6 py-4 lg:-mx-7 lg:px-7">
      <div className="flex items-center gap-1.5 text-[12px] text-dep-gray">
        {form.hasChanges ? (
          <>
            <div className="h-2 w-2 animate-pulse rounded-full bg-orange" />
            Modifications non enregistrées
          </>
        ) : (
          <>
            <div className="h-2 w-2 rounded-full bg-green" />
            Profil à jour
          </>
        )}
      </div>
      <motion.button
        type="button"
        whileHover={form.hasChanges ? { scale: 1.01 } : undefined}
        whileTap={form.hasChanges ? { scale: 0.99 } : undefined}
        onClick={onSave}
        disabled={!form.hasChanges || form.isSaving}
        className="flex items-center gap-2 rounded-xl bg-navy px-8 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-navy-2 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Save size={15} />
        {form.isSaving ? "Enregistrement..." : "Enregistrer les modifications"}
      </motion.button>
    </div>
  );
}
