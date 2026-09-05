import { RECENTLY_PROCESSED } from "@/components/admin/kyc/adminKycMock";

export function KycRecentlyProcessed({ hidden }: { hidden?: boolean }) {
  if (hidden) return null;
  return (
    <div className="mt-6">
      <h3 className="mb-3 font-['Syne'] text-[15px] font-bold text-[#0F1E35]">
        Traités récemment
      </h3>
      <div className="overflow-hidden rounded-2xl border border-[#E5E0D8] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="border-b border-[#E5E0D8]">
                {["Artisan", "Spécialité", "Décision", "Traité le", "Par", "Délai"].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-[#6B7280]"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {RECENTLY_PROCESSED.map((a, i) => (
                <tr
                  key={i}
                  className="border-b border-[rgba(229,224,216,0.5)] transition-colors last:border-0 hover:bg-[#FAF7F2]"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-[10px] font-bold text-white"
                        style={{ background: a.color }}
                      >
                        {a.initials}
                      </div>
                      <span className="font-medium text-[#0F1E35]">{a.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[#6B7280]">{a.spec}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                        a.decision === "approved"
                          ? "bg-[rgba(27,138,78,0.1)] text-[#1B8A4E]"
                          : "bg-[rgba(220,38,38,0.1)] text-[#DC2626]"
                      }`}
                    >
                      {a.decision === "approved" ? "✓ Approuvé" : "✕ Refusé"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#6B7280]">{a.date}</td>
                  <td className="px-4 py-3 text-[#6B7280]">{a.by}</td>
                  <td className="px-4 py-3 text-[#6B7280]">{a.delay}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
