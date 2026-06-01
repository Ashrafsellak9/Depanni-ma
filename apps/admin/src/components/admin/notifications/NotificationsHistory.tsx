"use client";

import toast from "react-hot-toast";

import {
  HISTORY_KPIS,
  SEND_HISTORY,
} from "@/components/admin/notifications/adminNotificationsMock";

export function NotificationsHistory() {
  return (
    <div>
      <div className="mb-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {HISTORY_KPIS.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-[#E5E0D8] bg-white p-4"
          >
            <div className="mb-2 text-[11px] text-[#6B7280]">{s.label}</div>
            <div className="font-['Syne'] text-[24px] font-bold text-[#0F1E35]">
              {s.value}
            </div>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#E5E0D8] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[12px]">
            <thead>
              <tr className="border-b border-[#E5E0D8]">
                {["Notification", "Audience", "Canaux", "Envoyés", "Ouverture", "Date", ""].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-[#6B7280]"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {SEND_HISTORY.map((s) => (
                <tr
                  key={s.id}
                  className="border-b border-[rgba(229,224,216,0.5)] transition-colors last:border-0 hover:bg-[#FAF7F2]"
                >
                  <td className="px-4 py-3">
                    <div className="font-medium text-[#0F1E35]">{s.title}</div>
                    <div className="text-[10px] text-[#9CA3AF]">{s.id}</div>
                  </td>
                  <td className="px-4 py-3 text-[#6B7280]">{s.audience}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {s.channels.map((c) => (
                        <span
                          key={c}
                          className="rounded bg-[rgba(15,30,53,0.07)] px-1.5 py-0.5 text-[9px] font-semibold text-[#0F1E35]"
                        >
                          {c === "push" ? "📱" : c === "sms" ? "💬" : "📧"}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-semibold text-[#0F1E35]">
                    {s.count.toLocaleString("fr-FR")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-[#E5E0D8]">
                        <div
                          className="h-full rounded-full bg-[#1B8A4E]"
                          style={{ width: `${s.openRate}%` }}
                        />
                      </div>
                      <span
                        className={`text-[11px] font-semibold ${
                          s.openRate >= 80
                            ? "text-[#1B8A4E]"
                            : s.openRate >= 60
                              ? "text-[#F05A1A]"
                              : "text-[#DC2626]"
                        }`}
                      >
                        {s.openRate}%
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[#6B7280]">{s.sentAt}</td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => toast.success(`Renvoi de « ${s.title} » programmé`)}
                      className="text-[11px] font-semibold text-[#F05A1A] hover:text-[#FF7A3D]"
                    >
                      Renvoyer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
