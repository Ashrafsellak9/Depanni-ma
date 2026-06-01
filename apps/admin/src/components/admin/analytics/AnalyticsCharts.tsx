"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  CATEGORY_MISSIONS,
  GMV_DAILY_DATA,
  INSCRIPTION_DATA,
} from "@/components/admin/analytics/adminAnalyticsMock";

export function AnalyticsGmvChart() {
  return (
    <div className="rounded-2xl border border-[#E5E0D8] bg-white p-5">
      <h3 className="mb-4 text-[14px] font-semibold text-[#0F1E35]">GMV par jour</h3>
      <div style={{ height: 180 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={GMV_DAILY_DATA} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="gmvGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F05A1A" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#F05A1A" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "#6B7280" }}
              interval={4}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "#6B7280" }}
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
            />
            <Tooltip
              contentStyle={{
                background: "white",
                border: "1px solid #E5E0D8",
                borderRadius: 8,
                fontSize: 11,
              }}
              formatter={(v: number) => [`${v.toLocaleString("fr-FR")} MAD`, "GMV"]}
            />
            <Area
              dataKey="gmv"
              stroke="#F05A1A"
              strokeWidth={2}
              fill="url(#gmvGrad)"
              dot={false}
              activeDot={{ r: 4, fill: "#F05A1A" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function AnalyticsCategoryChart() {
  return (
    <div className="rounded-2xl border border-[#E5E0D8] bg-white p-5">
      <h3 className="mb-4 text-[14px] font-semibold text-[#0F1E35]">
        Missions par catégorie
      </h3>
      <div style={{ height: 200 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={CATEGORY_MISSIONS}
            layout="vertical"
            margin={{ top: 0, right: 20, left: 10, bottom: 0 }}
            barSize={14}
          >
            <XAxis
              type="number"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "#6B7280" }}
            />
            <YAxis
              type="category"
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#0F1E35" }}
              width={130}
            />
            <Tooltip
              formatter={(v: number) => [v, "Missions"]}
              contentStyle={{
                background: "white",
                border: "1px solid #E5E0D8",
                borderRadius: 8,
                fontSize: 11,
              }}
            />
            <Bar dataKey="count" radius={[0, 4, 4, 0]}>
              {CATEGORY_MISSIONS.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function AnalyticsInscriptionsChart() {
  return (
    <div className="rounded-2xl border border-[#E5E0D8] bg-white p-5">
      <h3 className="mb-4 text-[14px] font-semibold text-[#0F1E35]">
        Croissance inscriptions
      </h3>
      <div style={{ height: 180 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={INSCRIPTION_DATA}
            barSize={18}
            margin={{ top: 4, right: 0, left: -20, bottom: 0 }}
          >
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "#6B7280" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "#6B7280" }}
            />
            <Tooltip
              contentStyle={{
                background: "white",
                border: "1px solid #E5E0D8",
                borderRadius: 8,
                fontSize: 11,
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: 11 }}
              formatter={(v) => (v === "citoyens" ? "Citoyens" : "Artisans")}
            />
            <Bar dataKey="citoyens" stackId="a" fill="#3B82F6" radius={[0, 0, 0, 0]} />
            <Bar dataKey="artisans" stackId="a" fill="#1B8A4E" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
