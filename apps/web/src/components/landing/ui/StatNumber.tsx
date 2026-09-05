"use client";

import { useEffect, useRef, useState } from "react";

import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

type StatNumberProps = {
  value: number;
  decimals?: number;
  className?: string;
};

export function StatNumber({ value, decimals = 0, className }: StatNumberProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = usePrefersReducedMotion();
  const [display, setDisplay] = useState(reduced ? value : 0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (reduced) {
      setDisplay(value);
      return;
    }

    let frame = 0;
    const duration = 1500;
    let started = false;

    const easeOut = (t: number) => 1 - (1 - t) ** 3;

    const run = (start: number) => {
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        const current = value * easeOut(t);
        setDisplay(current);
        if (t < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && !started) {
          started = true;
          run(performance.now());
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(node);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [reduced, value]);

  const formatted =
    decimals > 0
      ? (() => {
          const [intPart, frac] = display.toFixed(decimals).split(".");
          return `${intPart},${frac}`;
        })()
      : Math.floor(display).toLocaleString("fr-FR").replace(/\s/g, "\u00a0");

  return (
    <span ref={ref} className={cn("num font-mono tabular-nums tracking-[-0.02em]", className)}>
      {formatted}
    </span>
  );
}
