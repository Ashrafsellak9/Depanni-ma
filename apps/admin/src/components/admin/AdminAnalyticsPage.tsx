"use client";

import { useState } from "react";

import { AnalyticsCategoryChart, AnalyticsGmvChart, AnalyticsInscriptionsChart } from "@/components/admin/analytics/AnalyticsCharts";
import { AnalyticsFunnel } from "@/components/admin/analytics/AnalyticsFunnel";
import { AnalyticsGeoSection } from "@/components/admin/analytics/AnalyticsGeoSection";
import { AnalyticsHeatmap } from "@/components/admin/analytics/AnalyticsHeatmap";
import { AnalyticsKpiStrip } from "@/components/admin/analytics/AnalyticsKpiStrip";
import { AnalyticsObjectifsSection } from "@/components/admin/analytics/AnalyticsObjectifsSection";
import { AnalyticsTop10Section } from "@/components/admin/analytics/AnalyticsTop10Section";
import {
  ANALYTICS_KPIS,
  PERIOD_TABS,
  type AnalyticsPeriodKey,
} from "@/components/admin/analytics/adminAnalyticsMock";

export function AdminAnalyticsPage() {
  const [period, setPeriod] = useState<AnalyticsPeriodKey>("30j");
  const current = ANALYTICS_KPIS[period];

  return (
    <div>
      <div className="mb-5 flex flex-wrap rounded-xl border border-[#E5E0D8] bg-white p-1">
        {PERIOD_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setPeriod(tab.id)}
            className={`rounded-lg px-3 py-1.5 text-[12px] font-medium transition-colors ${
              period === tab.id
                ? "bg-[#0F1E35] text-white"
                : "text-[#6B7280] hover:bg-[#FAF7F2]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <AnalyticsKpiStrip kpi={current} />

      <div className="mb-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <AnalyticsGmvChart />
        <AnalyticsCategoryChart />
      </div>

      <AnalyticsInscriptionsChart />
      <AnalyticsHeatmap />
      <AnalyticsFunnel kpi={current} />
      <AnalyticsTop10Section />

      <AnalyticsObjectifsSection kpi={current} />
      <AnalyticsGeoSection />
    </div>
  );
}
