"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const TOP_ARTISANS = [
  {
    rank: 1,
    initials: "KA",
    bg: "linear-gradient(135deg, #F05A1A, #FF7A3D)",
    name: "Khalid A.",
    spec: "Plombier",
    missions: 32,
    rating: 4.9,
    revenue: "8 320",
  },
  {
    rank: 2,
    initials: "OB",
    bg: "linear-gradient(135deg, #7C3AED, #4F46E5)",
    name: "Omar B.",
    spec: "Électricien",
    missions: 28,
    rating: 4.8,
    revenue: "6 440",
  },
  {
    rank: 3,
    initials: "SK",
    bg: "linear-gradient(135deg, #059669, #047857)",
    name: "Saad K.",
    spec: "Mécanicien",
    missions: 24,
    rating: 4.7,
    revenue: "5 760",
  },
];

export function TopArtisansTable() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.45 }}
      className="overflow-hidden rounded-2xl border border-[#E5E0D8] bg-white"
    >
      <div className="flex items-center justify-between border-b border-[#E5E0D8] px-5 py-4">
        <h2 className="text-sm font-semibold text-navy">Top Artisans du mois</h2>
        <Link href="/admin/artisans" className="text-xs font-medium text-[#F05A1A] hover:underline">
          Voir tout →
        </Link>
      </div>
      <div className="overflow-x-auto p-2">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr>
              {["#", "Artisan", "Missions", "Note", "Revenus"].map((h) => (
                <th
                  key={h}
                  className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wider text-[#6B7280]"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TOP_ARTISANS.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-3 py-6 text-center text-sm text-[#6B7280]">
                  Aucune donnée
                </td>
              </tr>
            ) : (
              TOP_ARTISANS.map((a) => (
                <tr key={a.rank} className="hover:bg-[#FAF7F2]">
                  <td className="px-3 py-2.5">
                    <span
                      className={`font-syne text-sm font-bold ${
                        a.rank === 1 ? "text-[#F05A1A]" : "text-[#6B7280]"
                      }`}
                    >
                      {a.rank}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <div
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-[11px] font-bold text-white"
                        style={{ background: a.bg }}
                      >
                        {a.initials}
                      </div>
                      <div>
                        <p className="font-medium text-[#0F1E35]">{a.name}</p>
                        <p className="text-[11px] text-[#6B7280]">{a.spec}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2.5">{a.missions}</td>
                  <td className="px-3 py-2.5">{a.rating.toFixed(1)}★</td>
                  <td className="px-3 py-2.5 font-semibold text-[#1B8A4E]">{a.revenue} MAD</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
