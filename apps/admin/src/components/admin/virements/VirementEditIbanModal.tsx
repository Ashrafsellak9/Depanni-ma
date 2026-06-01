"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import type { Virement } from "@/components/admin/virements/adminVirementsMock";

type VirementEditIbanModalProps = {
  virementId: string | null;
  virements: Virement[];
  onClose: () => void;
  onSave: (id: string, iban: string, bank: string) => void;
};

export function VirementEditIbanModal({
  virementId,
  virements,
  onClose,
  onSave,
}: VirementEditIbanModalProps) {
  const virement = virements.find((v) => v.id === virementId);
  const [iban, setIban] = useState("");
  const [bank, setBank] = useState("CIH Bank");

  if (!virementId || !virement) return null;

  return (
    <AnimatePresence>
      {virementId && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-[rgba(0,0,0,0.4)]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
          >
            <div className="w-full max-w-[400px] rounded-2xl border border-[#E5E0D8] bg-white p-6 shadow-2xl">
              <h3 className="mb-1 font-['Syne'] text-[17px] font-bold text-[#0F1E35]">
                Corriger l&apos;IBAN
              </h3>
              <p className="mb-4 text-[12px] text-[#6B7280]">
                Artisan : {virement.artisan.name}
              </p>
              <div className="mb-4">
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-[#0F1E35]">
                  Nouvel IBAN / RIB
                </label>
                <input
                  type="text"
                  value={iban}
                  onChange={(e) => setIban(e.target.value)}
                  placeholder="MA64 0000 0000 0000 0000 0000 00"
                  className="w-full rounded-xl border border-[#E5E0D8] bg-[#FAF7F2] px-4 py-3 font-mono text-[13px] outline-none transition-all focus:border-[#0F1E35]"
                />
              </div>
              <div className="mb-4">
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-[#0F1E35]">
                  Banque
                </label>
                <select
                  value={bank}
                  onChange={(e) => setBank(e.target.value)}
                  className="w-full cursor-pointer rounded-xl border border-[#E5E0D8] bg-[#FAF7F2] px-4 py-3 text-[13px] outline-none"
                >
                  <option>CIH Bank</option>
                  <option>Attijariwafa</option>
                  <option>Banque Populaire</option>
                  <option>BMCE Bank</option>
                  <option>Orange Money</option>
                  <option>Inwi Money</option>
                </select>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 rounded-xl border border-[#E5E0D8] bg-[#FAF7F2] py-3 text-[13px] font-medium text-[#6B7280]"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={() => onSave(virementId, iban || "MA64 ****XXXX", bank)}
                  className="flex-1 rounded-xl bg-[#0F1E35] py-3 text-[13px] font-bold text-white"
                >
                  Sauvegarder & Relancer
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
