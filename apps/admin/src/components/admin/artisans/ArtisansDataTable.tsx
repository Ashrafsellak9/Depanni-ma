"use client";

import { BadgeCheck, Ban } from "lucide-react";

import type { AdminArtisan } from "@/components/admin/artisans/adminArtisansMock";
import { ArtisanStatusPill } from "@/components/admin/artisans/ArtisanStatusPill";

type ArtisansDataTableProps = {
  rows: AdminArtisan[];
  onSelect: (artisan: AdminArtisan) => void;
  onApprove: (id: string) => void;
  onSuspend: (id: string) => void;
  onReactivate: (id: string) => void;
};

export function ArtisansDataTable({
  rows,
  onSelect,
  onApprove,
  onSuspend,
  onReactivate,
}: ArtisansDataTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#E5E0D8] bg-white">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr className="border-b border-[#E5E0D8]">
              {[
                "Artisan",
                "Spécialité",
                "Zone",
                "Missions",
                "Note",
                "Statut",
                "Commission",
                "Actions",
              ].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#6B7280]"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((a) => (
              <tr
                key={a.id}
                onClick={() => onSelect(a)}
                className={`cursor-pointer border-b border-[rgba(229,224,216,0.5)] transition-colors last:border-0 hover:bg-[#FAF7F2] ${
                  a.status === "suspended" ? "bg-[rgba(220,38,38,0.02)]" : ""
                }`}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-[11px] font-bold text-white"
                      style={{ background: a.color }}
                    >
                      {a.initials}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[13px] font-medium text-[#0F1E35]">{a.name}</span>
                        {a.verified && <BadgeCheck size={13} className="text-[#1B8A4E]" />}
                        {a.plan === "Premium" && (
                          <span className="rounded-full bg-[rgba(240,90,26,0.1)] px-1.5 py-0.5 text-[9px] font-bold text-[#F05A1A]">
                            PRO
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-[#6B7280]">{a.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="flex items-center gap-1.5 text-[12px] text-[#0F1E35]">
                    <span className="text-[14px]">{a.specEmoji}</span>
                    {a.spec}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-[12px] text-[#6B7280]">{a.zone}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-[13px] font-semibold text-[#0F1E35]">{a.missions}</span>
                </td>
                <td className="px-4 py-3">
                  {a.rating != null ? (
                    <div className="flex items-center gap-1">
                      <span className="text-[11px] text-[#F05A1A]">★</span>
                      <span className="text-[13px] font-semibold text-[#0F1E35]">
                        {a.rating.toFixed(1)}
                      </span>
                    </div>
                  ) : (
                    <span className="text-[11px] italic text-[#9CA3AF]">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <ArtisanStatusPill status={a.status} />
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`text-[12px] font-medium ${
                      a.commission === "10%" ? "text-[#1B8A4E]" : "text-[#0F1E35]"
                    }`}
                  >
                    {a.commission}
                  </span>
                </td>
                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => onSelect(a)}
                      className="rounded-lg border border-[#E5E0D8] bg-[#FAF7F2] px-2.5 py-1.5 text-[11px] font-medium text-[#0F1E35] transition-colors hover:bg-[#F0EBE1]"
                    >
                      Voir
                    </button>
                    {a.status === "pending" && (
                      <button
                        type="button"
                        onClick={() => onApprove(a.id)}
                        className="rounded-lg bg-[rgba(27,138,78,0.1)] px-2.5 py-1.5 text-[11px] font-semibold text-[#1B8A4E] transition-colors hover:bg-[rgba(27,138,78,0.15)]"
                      >
                        ✓ KYC
                      </button>
                    )}
                    {a.status === "active" && (
                      <button
                        type="button"
                        onClick={() => onSuspend(a.id)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg bg-[rgba(220,38,38,0.07)] text-[#DC2626] transition-colors hover:bg-[rgba(220,38,38,0.12)]"
                        aria-label="Suspendre"
                      >
                        <Ban size={12} />
                      </button>
                    )}
                    {a.status === "suspended" && (
                      <button
                        type="button"
                        onClick={() => onReactivate(a.id)}
                        className="rounded-lg bg-[rgba(27,138,78,0.1)] px-2.5 py-1.5 text-[11px] font-semibold text-[#1B8A4E]"
                      >
                        Réactiver
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {rows.length === 0 && (
        <div className="py-16 text-center">
          <div className="mb-3 text-[40px]">👷</div>
          <div className="mb-1 text-[15px] font-semibold text-[#0F1E35]">Aucun artisan trouvé</div>
          <div className="text-[13px] text-[#6B7280]">Essayez d&apos;autres filtres</div>
        </div>
      )}
    </div>
  );
}
