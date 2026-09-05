"use client";

import { motion, useInView } from "framer-motion";
import {
  CheckCircle,
  ClipboardList,
  Star,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

const KPIS = [
  {
    label: "Missions ce mois",
    value: 12,
    suffix: "",
    icon: ClipboardList,
    color: "orange" as const,
    change: "+3 vs mois dernier",
  },
  {
    label: "Revenus ce mois",
    value: 3200,
    suffix: " MAD",
    icon: Wallet,
    color: "green" as const,
    change: "+15% vs mois dernier",
  },
  {
    label: "Ma note",
    value: 4.9,
    suffix: "/5",
    icon: Star,
    color: "orange" as const,
    change: "200 avis clients",
  },
  {
    label: "Taux completion",
    value: 97,
    suffix: "%",
    icon: CheckCircle,
    color: "green" as const,
    change: "Excellent",
  },
];

const ICON_STYLES = {
  orange: "bg-orange/10 text-orange",
  green: "bg-green/10 text-green",
};

function CountUp({ value, suffix }: { value: number; suffix: string }) {
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
    <span ref={ref} className="font-display text-[32px] font-extrabold tracking-tight text-navy">
      {formatted}
      {suffix && <span className="font-sans text-lg font-normal text-dep-gray">{suffix}</span>}
    </span>
  );
}

function KpiCard({
  label,
  value,
  suffix,
  change,
  icon: Icon,
  color,
  delay,
}: (typeof KPIS)[number] & { delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: "easeOut" }}
      className="rounded-2xl border border-dep-border bg-white p-5"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs text-dep-gray">{label}</p>
        <div
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-xl",
            ICON_STYLES[color],
          )}
        >
          <Icon className="h-[18px] w-[18px]" />
        </div>
      </div>
      <div className="mt-3">
        <CountUp value={value} suffix={suffix} />
      </div>
      <p className="mt-1 text-[11px] text-dep-gray">{change}</p>
    </motion.div>
  );
}

export function KpiStrip() {
  return (
    <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {KPIS.map((kpi, i) => (
        <KpiCard key={kpi.label} {...kpi} delay={i * 0.08} />
      ))}
    </div>
  );
}
