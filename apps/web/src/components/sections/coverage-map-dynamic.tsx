"use client";

import dynamic from "next/dynamic";

export const CoverageMap = dynamic(
  () => import("@/components/sections/coverage-map").then((m) => m.CoverageMap),
  {
    ssr: false,
    loading: () => (
      <div className="h-[500px] animate-pulse rounded-3xl bg-paper-2 lg:h-[600px]" aria-hidden />
    ),
  },
);
