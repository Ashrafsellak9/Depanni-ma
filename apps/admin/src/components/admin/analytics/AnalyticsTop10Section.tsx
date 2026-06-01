import { AvatarCell } from "@/components/admin/AvatarCell";
import {
  TOP10_MISSIONS,
  TOP10_RATING,
  TOP10_REVENUE,
  type Top10Entry,
} from "@/components/admin/analytics/adminAnalyticsMock";

function Top10List({ title, list }: { title: string; list: Top10Entry[] }) {
  return (
    <div className="rounded-2xl border border-[#E5E0D8] bg-white p-5">
      <h3 className="mb-3 text-[14px] font-semibold text-[#0F1E35]">Top 10 — {title}</h3>
      <div>
        {list.map((a, i) => (
          <div
            key={a.name}
            className="flex items-center gap-2.5 border-b border-[rgba(229,224,216,0.4)] py-2 last:border-0"
          >
            <span
              className={`w-4 font-['Syne'] text-[13px] font-bold ${
                i === 0 ? "text-[#F05A1A]" : "text-[#9CA3AF]"
              }`}
            >
              {i + 1}
            </span>
            <AvatarCell initials={a.initials} color={a.color} size="sm" />
            <span className="flex-1 truncate text-[12px] font-medium text-[#0F1E35]">
              {a.name}
            </span>
            <span
              className={`text-[12px] font-semibold ${
                typeof a.value === "number" && a.value < 10
                  ? "text-[#F05A1A]"
                  : "text-[#1B8A4E]"
              }`}
            >
              {typeof a.value === "number" && a.value < 10
                ? `★ ${a.value.toFixed(1)}`
                : a.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AnalyticsTop10Section() {
  return (
    <div className="mb-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
      <Top10List title="Par revenu" list={TOP10_REVENUE} />
      <Top10List title="Par missions" list={TOP10_MISSIONS} />
      <Top10List title="Par note" list={TOP10_RATING} />
    </div>
  );
}
