"use client";

import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";

import { viewportOnce } from "@/components/landing/motion";

interface StatItem {
  value: number;
  suffix: string;
  accent?: string;
  label: string;
  decimals?: number;
}

const STATS: StatItem[] = [
  { value: 1200, suffix: "+", label: "clients satisfaits", accent: "+" },
  { value: 280, suffix: "+", label: "artisans vérifiés" },
  { value: 4.8, suffix: "/5", label: "note moyenne", decimals: 1 },
  { value: 8, suffix: "min", label: "première offre", accent: "<" },
];

function AnimatedNumber({
  value,
  suffix,
  accent,
  decimals = 0,
}: {
  value: number;
  suffix: string;
  accent?: string;
  decimals?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, viewportOnce);
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { duration: 1800, bounce: 0 });
  const display = useTransform(spring, (v) =>
    decimals > 0 ? v.toFixed(decimals) : Math.floor(v).toLocaleString("fr-FR"),
  );

  useEffect(() => {
    if (inView) motionValue.set(value);
  }, [inView, motionValue, value]);

  return (
    <span ref={ref} className="font-syne text-[32px] font-extrabold leading-none text-white md:text-5xl">
      {accent && <span className="text-orange">{accent}</span>}
      <motion.span>{display}</motion.span>
      <span className="text-orange">{suffix}</span>
    </span>
  );
}

export function StatsBar() {
  return (
    <section className="bg-navy py-14 md:py-16">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewportOnce}
        transition={{ duration: 0.6 }}
        className="container mx-auto grid grid-cols-2 gap-8 px-4 md:grid-cols-4 md:gap-6"
      >
        {STATS.map((stat) => (
          <div key={stat.label} className="text-center md:text-left">
            <AnimatedNumber
              value={stat.value}
              suffix={stat.suffix}
              accent={stat.accent}
              decimals={stat.decimals}
            />
            <p className="mt-2 text-sm text-white/50">{stat.label}</p>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
