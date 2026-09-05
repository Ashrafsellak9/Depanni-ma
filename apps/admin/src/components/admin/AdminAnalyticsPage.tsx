"use client";

import { useEffect, useState } from "react";

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
  type AnalyticsKpiSnapshot,
  type AnalyticsPeriodKey,
} from "@/components/admin/analytics/adminAnalyticsMock";
import { mapAnalyticsToKpi } from "@/lib/adminUiMappers";
import { fetchAnalytics } from "@/services/adminApi";
import type { AnalyticsPeriod } from "@/types/analytics";

const PERIOD_MAP: Record<AnalyticsPeriodKey, AnalyticsPeriod> = {
  "7j": "7d",
  "30j": "30d",
  "90j": "90d",
  "12m": "12m",
};

export function AdminAnalyticsPage() {
  const [period, setPeriod] = useState<AnalyticsPeriodKey>("30j");
  const [live, setLive] = useState<AnalyticsKpiSnapshot | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetchAnalytics({ period: PERIOD_MAP[period] })
      .then((dash) => {
        if (!cancelled) {
          setLive(mapAnalyticsToKpi(dash));
          setError("");
        }
      })
      .catch(() => {
        if (!cancelled) {
          setLive(null);
          setError("Analytics API indisponible — affichage des indicateurs de repli.");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [period]);

  const current = live ?? ANALYTICS_KPIS[period];

  return (
    <div>
      {error && (
        <p className="mb-4 rounded-xl border border-orange/20 bg-orange/[0.06] px-4 py-2 text-sm text-navy">
          {error}
        </p>
      )}
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
