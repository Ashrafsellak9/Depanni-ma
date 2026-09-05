"use client";

import { useEffect, useRef } from "react";

import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const VALUES = [18, 21, 20, 27, 32, 30, 38, 44, 42, 51, 56, 64];
const WIDTH = 240;
const HEIGHT = 64;
const PAD = 6;

type Pt = { x: number; y: number };

function toPoints(values: number[]): Pt[] {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = Math.max(1, max - min);
  return values.map((v, i) => ({
    x: (i / (values.length - 1)) * WIDTH,
    y: HEIGHT - PAD - ((v - min) / range) * (HEIGHT - PAD * 2),
  }));
}

function catmullRomPath(points: Pt[]): string {
  if (points.length < 2) return "";
  const first = points[0];
  if (!first) return "";
  let d = `M ${first.x.toFixed(2)} ${first.y.toFixed(2)}`;
  for (let i = 0; i < points.length - 1; i += 1) {
    const p0 = points[i - 1] ?? points[i] ?? first;
    const p1 = points[i] ?? first;
    const p2 = points[i + 1] ?? p1;
    const p3 = points[i + 2] ?? p2;
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
  }
  return d;
}

export function Sparkline() {
  const strokeRef = useRef<SVGPathElement>(null);
  const reduced = usePrefersReducedMotion();
  const points = toPoints(VALUES);
  const line = catmullRomPath(points);
  const last = points[points.length - 1];
  const first = points[0];
  const area =
    first && last
      ? `${line} L ${last.x.toFixed(2)} ${HEIGHT} L ${first.x.toFixed(2)} ${HEIGHT} Z`
      : "";

  useEffect(() => {
    const path = strokeRef.current;
    if (!path) return;
    const length = path.getTotalLength();
    path.style.strokeDasharray = `${length}`;
    if (reduced) {
      path.style.strokeDashoffset = "0";
      return;
    }
    path.style.strokeDashoffset = `${length}`;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        path.style.transition = "stroke-dashoffset 1.2s ease-out";
        path.style.strokeDashoffset = "0";
        io.disconnect();
      },
      { threshold: 0.4 },
    );
    io.observe(path);
    return () => io.disconnect();
  }, [reduced]);

  if (!last) return null;

  return (
    <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="mt-6 h-16 w-full" aria-hidden>
      <path d={area} fill="#D9451F" fillOpacity="0.1" />
      <path
        ref={strokeRef}
        d={line}
        fill="none"
        stroke="#D9451F"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={last.x} cy={last.y} r="3" fill="#D9451F" className="animate-pulse-soft" />
    </svg>
  );
}
