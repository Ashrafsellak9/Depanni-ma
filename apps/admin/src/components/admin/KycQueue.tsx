"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const KYC_ARTISANS = [
  {
    initials: "RF",
    bg: "linear-gradient(135deg, #F05A1A, #FF7A3D)",
    name: "Rachid El Filali",
    spec: "Électricien",
    docs: "CIN + diplôme uploadés",
    complete: true,
  },
  {
    initials: "SM",
    bg: "linear-gradient(135deg, #7C3AED, #4F46E5)",
    name: "Samir Moussaoui",
    spec: "Serrurier",
    docs: "CIN uploadé (diplôme manquant)",
    complete: false,
  },
  {
    initials: "AB",
    bg: "linear-gradient(135deg, #059669, #047857)",
    name: "Ahmed Benmoussa",
    spec: "Plombier",
    docs: "Tous documents complets",
    complete: true,
  },
];

export type KycQueueItem = {
  id?: string;
  initials: string;
  bg?: string;
  gradient?: string;
  name: string;
  spec: string;
  docs: string;
  complete: boolean;
};

export function KycQueue({
  items,
  pendingCount,
  onApprove,
  onReject,
}: {
  items?: KycQueueItem[];
  pendingCount?: number;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}) {
  const list = items ?? KYC_ARTISANS;
  const count = pendingCount ?? list.length;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
      className="overflow-hidden rounded-2xl border border-[#E5E0D8] bg-white"
    >
      <div className="flex items-center justify-between border-b border-[#E5E0D8] px-5 py-4">
        <h2 className="text-sm font-semibold text-navy">KYC Artisans en attente</h2>
        <span className="rounded-full bg-[#F05A1A] px-2 py-0.5 text-[10px] font-bold text-white">
          {count}
        </span>
      </div>
      <div className="p-4">
        {list.length === 0 ? (
          <p className="py-6 text-center text-sm text-[#6B7280]">Aucune donnée</p>
        ) : (
          list.map((item) => (
            <div
              key={item.id ?? item.name}
              className="mb-2 flex items-center gap-2.5 rounded-xl border border-[#E5E0D8] bg-[#F4F0E8] p-3"
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] text-sm font-bold text-white ${
                  item.gradient && !item.bg ? `bg-gradient-to-br ${item.gradient}` : ""
                }`}
                style={
                  item.bg
                    ? { background: item.bg }
                    : item.gradient
                      ? undefined
                      : { background: "linear-gradient(135deg, #F05A1A, #FF7A3D)" }
                }
              >
                {item.initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-semibold text-[#0F1E35]">{item.name}</p>
                <p className="mt-0.5 text-[10px] text-[#6B7280]">
                  {item.spec} · {item.docs}
                </p>
              </div>
              <div className="flex shrink-0 gap-1.5">
                <button
                  type="button"
                  onClick={() => item.id && onApprove?.(item.id)}
                  className="rounded-lg bg-[#1B8A4E] px-3 py-1.5 text-[11px] font-semibold text-white"
                >
                  ✓
                </button>
                <button
                  type="button"
                  onClick={() => item.id && onReject?.(item.id)}
                  className="rounded-lg border border-[rgba(220,38,38,0.2)] bg-[rgba(220,38,38,0.08)] px-3 py-1.5 text-[11px] font-semibold text-[#DC2626]"
                >
                  ✕
                </button>
              </div>
            </div>
          ))
        )}
        <Link
          href="/admin/kyc"
          className="mt-2 block cursor-pointer text-center text-[12px] text-[#F05A1A] hover:underline"
        >
          Voir la file KYC →
        </Link>
      </div>
    </motion.div>
  );
}
