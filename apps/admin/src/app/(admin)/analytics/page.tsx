"use client";

import { AnalyticsDashboard } from "@/components/analytics/AnalyticsDashboard";

export default function AnalyticsPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Analytics</h2>
      <AnalyticsDashboard />
    </div>
  );
}
