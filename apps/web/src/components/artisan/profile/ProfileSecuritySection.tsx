"use client";

import { AlertCircle, Check, ChevronRight, Lock, Shield } from "lucide-react";

const DOCUMENTS = [
  { label: "CIN Recto", status: "verified" as const, date: "Vérifié le 15 Mar 2026" },
  { label: "CIN Verso", status: "verified" as const, date: "Vérifié le 15 Mar 2026" },
  { label: "Photo de profil", status: "verified" as const, date: "Mise à jour le 01 Mai" },
  { label: "Attestation compétence", status: "missing" as const, date: null },
];

export function ProfileSecuritySection() {
  return (
    <div className="mb-5 rounded-2xl border border-dep-border bg-white p-6">
      <h3 className="mb-4 flex items-center gap-2 text-[14px] font-semibold text-navy">
        <Shield size={15} className="text-orange" />
        Sécurité & Documents
      </h3>

      <div className="mb-5 space-y-0">
        {DOCUMENTS.map((doc) => (
          <div
            key={doc.label}
            className="flex items-center justify-between border-b border-dep-border/50 py-2.5 last:border-0"
          >
            <div className="flex items-center gap-2.5">
              <div
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                  doc.status === "verified" ? "bg-green/10" : "bg-dep-gray/10"
                }`}
              >
                {doc.status === "verified" ? (
                  <Check size={12} className="text-green" />
                ) : (
                  <AlertCircle size={12} className="text-dep-gray" />
                )}
              </div>
              <div>
                <div className="text-[13px] font-medium text-navy">{doc.label}</div>
                {doc.date && <div className="text-[10px] text-dep-gray">{doc.date}</div>}
              </div>
            </div>
            {doc.status === "missing" ? (
              <label className="cursor-pointer rounded-full bg-orange/10 px-3 py-1.5 text-[11px] font-semibold text-orange transition-colors hover:bg-orange/15">
                + Ajouter
                <input type="file" className="hidden" />
              </label>
            ) : (
              <label className="cursor-pointer text-[11px] text-dep-gray transition-colors hover:text-navy">
                Remplacer
                <input type="file" className="hidden" />
              </label>
            )}
          </div>
        ))}
      </div>

      <div className="border-t border-dep-border pt-4">
        <button
          type="button"
          className="flex items-center gap-2 text-[13px] font-medium text-navy transition-colors hover:text-orange"
        >
          <Lock size={14} />
          Changer mon mot de passe
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
