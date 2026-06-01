"use client";

import { AlertTriangle } from "lucide-react";

type LitigesAlertBannerProps = {
  overdueCount: number;
  highAmountCount: number;
  onPriorityClick: () => void;
};

export function LitigesAlertBanner({
  overdueCount,
  highAmountCount,
  onPriorityClick,
}: LitigesAlertBannerProps) {
  if (overdueCount === 0 && highAmountCount === 0) return null;

  return (
    <div className="mb-5 flex items-center gap-3 rounded-xl border border-[rgba(220,38,38,0.2)] bg-[rgba(220,38,38,0.07)] px-4 py-3">
      <AlertTriangle size={16} className="flex-shrink-0 text-[#DC2626]" />
      <p className="flex-1 text-[12px] text-[#0F1E35]">
        {overdueCount > 0 && (
          <>
            <strong className="text-[#DC2626]">
              {overdueCount} litige{overdueCount > 1 ? "s" : ""} urgent
              {overdueCount > 1 ? "s" : ""}
            </strong>{" "}
            dépassent 72h sans résolution
          </>
        )}
        {overdueCount > 0 && highAmountCount > 0 && " · "}
        {highAmountCount > 0 && (
          <>
            <strong className="text-[#DC2626]">
              {highAmountCount} litige{highAmountCount > 1 ? "s" : ""}
            </strong>{" "}
            implique{highAmountCount === 1 ? "" : "nt"} un montant supérieur à 500 MAD
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
