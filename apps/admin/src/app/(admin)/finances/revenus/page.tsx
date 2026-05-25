"use client";

import { RevenueReportView } from "@/components/finances/RevenueReportView";

export default function RevenusPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Revenus</h2>
      <RevenueReportView />
    </div>
  );
}
