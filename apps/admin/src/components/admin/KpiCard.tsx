"use client";

import { motion, useInView } from "framer-motion";
import {
  Banknote,
  ClipboardList,
  Clock,
  HardHat,
  Star,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type IconBg = "orange" | "navy" | "green" | "purple";

const ICON_MAP: Record<string, LucideIcon> = {
  ClipboardList,
  Banknote,
  HardHat,
  Star,
  Zap,
  Clock,
};

const ICON_BG: Record<IconBg, string> = {
  orange: "bg-orange/10 text-orange",
  navy: "bg-navy/[0.08] text-navy",
  green: "bg-green/10 text-green",
  purple: "bg-dep-purple/10 text-dep-purple",
};

export const KPI_DATA = [
  {
    label: "Missions aujourd'hui",
    value: 47,
    suffix: "",
    change: "+12% vs hier",
    trend: "up" as const,
    icon: "ClipboardList",
    iconBg: "orange" as const,
  },
  {
    label: "GMV du jour (MAD)",
    value: 18200,
    suffix: " MAD",
    change: "+8% vs hier",
    trend: "up" as const,
    icon: "Banknote",
    iconBg: "navy" as const,
  },
  {
    label: "Artisans actifs",
    value: 38,
    suffix: "",
    change: "+5 en ligne",
    trend: "up" as const,
    icon: "HardHat",
    iconBg: "green" as const,
  },
  {
    label: "Satisfaction client",
    value: 4.8,
    suffix: "/5",
    change: "+0.1 ce mois",
    trend: "up" as const,
    icon: "Star",
    iconBg: "purple" as const,
  },
];

export type KpiDataItem = (typeof KPI_DATA)[number];

function CountUpValue({
  value,
  suffix,
}: {
  value: number;
  suffix: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [displayed, setDisplayed] = useState(0);
  const isDecimal = !Number.isInteger(value);

  useEffect(() => {
    if (!isInView) return;
    const duration = 1500;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayed(value);
        clearInterval(timer);
      } else {
        setDisplayed(current);
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [isInView, value]);

  const formatted = isDecimal
    ? displayed.toFixed(1)
    : Math.round(displayed).toLocaleString("fr-FR");

  return (
    <span
      ref={ref}
      className="font-syne text-[32px] font-extrabold tracking-tight text-[#0F1E35]"
    >
      {formatted}
      {suffix && (
        <span className="font-dm text-lg font-normal text-dep-gray">{suffix}</span>
      )}
    </span>
  );
}

export function KpiCard({
  label,
  value,
  suffix,
  change,
  trend,
  icon,
  iconBg,
}: KpiDataItem) {
  const Icon = ICON_MAP[icon] ?? ClipboardList;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-[#E5E0D8] bg-white p-5"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs text-dep-gray">{label}</p>
        <div className={cn("flex h-9 w-9 items-center justify-center rounded-xl", ICON_BG[iconBg])}>
          <Icon className="h-[18px] w-[18px]" />
        </div>
      </div>
      <div className="mt-3">
        <CountUpValue value={value} suffix={suffix} />
      </div>
      <p
        className={cn(
          "mt-1 text-xs font-medium",
          trend === "up" ? "text-green" : "text-dep-red",
        )}
      >
        {trend === "up" ? "↑" : "↓"} {change}
      </p>
    </motion.div>
  );
}
