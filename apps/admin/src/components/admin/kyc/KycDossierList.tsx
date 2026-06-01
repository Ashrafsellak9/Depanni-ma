"use client";

import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

import {
  DOC_KEYS,
  KYC_FILTER_TABS,
  type KycDossier,
  type KycFilterId,
} from "@/components/admin/kyc/adminKycMock";

type KycDossierListProps = {
  dossiers: KycDossier[];
  selectedId: string | null;
  filter: KycFilterId;
  onFilterChange: (id: KycFilterId) => void;
  onSelect: (d: KycDossier) => void;
  onApprove: (id: string) => void;
  onRejectStart: (d: KycDossier) => void;
};

export function KycDossierList({
  dossiers,
  selectedId,
  filter,
  onFilterChange,
  onSelect,
  onApprove,
  onRejectStart,
}: KycDossierListProps) {
  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <div className="flex gap-1 rounded-xl border border-[#E5E0D8] bg-white p-1">
          {KYC_FILTER_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => onFilterChange(tab.id)}
              className={`whitespace-nowrap rounded-lg px-2.5 py-1.5 text-[11px] font-medium transition-all ${
                filter === tab.id
                  ? "bg-[#0F1E35] text-white"
                  : "text-[#6B7280] hover:text-[#0F1E35]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <span className="ml-auto text-[12px] text-[#6B7280]">{dossiers.length} dossiers</span>
      </div>

      {dossiers.length === 0 ? (
        <div className="rounded-2xl border border-[#E5E0D8] bg-white py-16 text-center">
          <div className="mb-3 text-[40px]">✅</div>
          <div className="text-[15px] font-semibold text-[#0F1E35]">Aucun dossier en attente</div>
          <div className="text-[13px] text-[#6B7280]">Tous les dossiers ont été traités</div>
        </div>
      ) : (
        dossiers.map((d) => (
          <motion.div
            key={d.id}
            layout
            onClick={() => onSelect(d)}
            className={`mb-3 cursor-pointer rounded-2xl border bg-white p-4 transition-all hover:-translate-y-0.5 hover:shadow-sm ${
              selectedId === d.id
                ? "border-[#F05A1A] bg-[rgba(240,90,26,0.02)]"
                : d.waitingHours >= 48
                  ? "border-[rgba(220,38,38,0.3)]"
                  : "border-[#E5E0D8]"
            }`}
          >
            <div className="mb-3 flex items-start gap-3">
              <div
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-[13px] font-bold text-white"
                style={{ background: d.color }}
              >
                {d.initials}
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-0.5 flex items-center gap-2">
                  <span className="truncate text-[13px] font-semibold text-[#0F1E35]">{d.name}</span>
                  {d.waitingHours >= 48 && (
                    <span className="flex-shrink-0 rounded-full bg-[rgba(220,38,38,0.1)] px-1.5 py-0.5 text-[9px] font-bold text-[#DC2626]">
                      URGENT
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-[#6B7280]">
                  {d.specEmoji} {d.spec} · {d.city}
                </div>
              </div>
              <div className="flex-shrink-0 text-right">
                <div
                  className={`text-[11px] font-semibold ${
                    d.waitingHours >= 48
                      ? "text-[#DC2626]"
                      : d.waitingHours >= 24
                        ? "text-[#F05A1A]"
                        : "text-[#6B7280]"
                  }`}
                >
                  ⏱ {d.waitingHours}h
                </div>
                <div className="mt-0.5 text-[10px] text-[#9CA3AF]">{d.id}</div>
              </div>
            </div>

            <div className="mb-3">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-[10px] text-[#6B7280]">Complétude du dossier</span>
                <span
                  className={`text-[10px] font-bold ${
                    d.completeness === 100 ? "text-[#1B8A4E]" : "text-[#F05A1A]"
                  }`}
                >
                  {d.completeness}%
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-[#E5E0D8]">
                <div
                  className={`h-full rounded-full transition-all ${
                    d.completeness === 100 ? "bg-[#1B8A4E]" : "bg-[#F05A1A]"
                  }`}
                  style={{ width: `${d.completeness}%` }}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              {DOC_KEYS.map((doc) => (
                <div
                  key={doc.key}
                  className={`flex items-center gap-1 rounded-lg px-2 py-1 text-[9px] font-semibold ${
                    d.documents[doc.key].status === "uploaded"
                      ? "bg-[rgba(27,138,78,0.1)] text-[#1B8A4E]"
                      : "bg-[rgba(107,114,128,0.1)] text-[#9CA3AF]"
                  }`}
                >
                  {d.documents[doc.key].status === "uploaded" ? "✓" : "○"}
                  {doc.label}
                </div>
              ))}
            </div>

            <div className="mt-3 flex gap-2 border-t border-[#E5E0D8] pt-3">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onApprove(d.id);
                }}
                className="flex flex-1 items-center justify-center gap-1 rounded-xl border border-[rgba(27,138,78,0.15)] bg-[rgba(27,138,78,0.08)] py-2 text-[11px] font-semibold text-[#1B8A4E] transition-colors hover:bg-[rgba(27,138,78,0.12)]"
              >
                <Check size={11} />
                Approuver
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRejectStart(d);
                }}
                className="flex flex-1 items-center justify-center gap-1 rounded-xl border border-[rgba(220,38,38,0.12)] bg-[rgba(220,38,38,0.06)] py-2 text-[11px] font-semibold text-[#DC2626] transition-colors hover:bg-[rgba(220,38,38,0.1)]"
              >
                <X size={11} />
                Refuser
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(d);
                }}
                className="rounded-xl border border-[#E5E0D8] bg-[#FAF7F2] px-3 py-2 text-[11px] font-medium text-[#0F1E35] transition-colors hover:bg-[#F0EBE1]"
              >
                Détail →
              </button>
            </div>
          </motion.div>
        ))
      )}
    </div>
  );
}
