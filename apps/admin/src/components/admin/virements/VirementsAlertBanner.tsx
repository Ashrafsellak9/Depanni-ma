"use client";

import { AlertTriangle } from "lucide-react";

type VirementsAlertBannerProps = {
  overdueCount: number;
  failedCount: number;
  onPriorityClick: () => void;
};

export function VirementsAlertBanner({
  overdueCount,
  failedCount,
  onPriorityClick,
}: VirementsAlertBannerProps) {
  if (overdueCount === 0 && failedCount === 0) return null;

  return (
    <div className="mb-5 flex flex-wrap items-center gap-3 rounded-xl border border-[rgba(220,38,38,0.2)] bg-[rgba(220,38,38,0.07)] px-4 py-3">
      <AlertTriangle size={16} className="flex-shrink-0 text-[#DC2626]" />
      <p className="flex-1 text-[12px] text-[#0F1E35]">
        {overdueCount > 0 && (
          <>
            <strong className="text-[#DC2626]">
              {overdueCount} virement{overdueCount > 1 ? "s" : ""}
            </strong>{" "}
            dépassent 24h sans traitement
          </>
        )}
        {overdueCount > 0 && failedCount > 0 && " · "}
        {failedCount > 0 && (
          <>
            <strong className="text-[#DC2626]">
              {failedCount} virement{failedCount > 1 ? "s" : ""}
            </strong>{" "}
            en échec (IBAN invalide) — action requise
          </>
        )}
      </p>
      <button
        type="button"
        onClick={onPriorityClick}
        className="whitespace-nowrap text-[12px] font-semibold text-[#F05A1A]"
      >
        Traiter en priorité →
      </button>
    </div>
  );
}
