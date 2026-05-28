"use client";

import { motion } from "framer-motion";
import {
  ClipboardCheck,
  Percent,
  TrendingUp,
  Wallet,
  type LucideIcon,
} from "lucide-react";

import { KPIS } from "@/components/artisan/artisanRevenusMock";

const ICONS: Record<string, LucideIcon> = {
  TrendingUp,
  Wallet,
  Percent,
  ClipboardCheck,
};

export function EarningsKpiStrip() {
  return (
    <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {KPIS.map((kpi, i) => {
        const Icon = ICONS[kpi.icon] ?? TrendingUp;
        return (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="rounded-2xl border border-dep-border bg-white p-5"
          >
            <div className="mb-3 flex items-start justify-between">
              <span className="text-[12px] font-medium text-dep-gray">{kpi.label}</span>
              <div
                className="flex h-9 w-9 items-center justify-center rounded-xl"
                style={{ background: kpi.iconBg }}
              >
                <Icon size={16} style={{ color: kpi.iconColor }} />
              </div>
            </div>
            <div className="mb-1.5 font-syne text-[28px] font-extrabold leading-none tracking-[-1px] text-navy">
              {kpi.value}
              {kpi.suffix && (
                <span className="ml-1 font-dm text-[14px] font-normal text-dep-gray">{kpi.suffix}</span>
              )}
            </div>
            <div
              className={`text-[11px] font-medium ${
                kpi.changeUp === true ? "text-green" : "text-dep-gray"
              }`}
            >
              {kpi.changeUp === true && "↑ "}
              {kpi.change}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
