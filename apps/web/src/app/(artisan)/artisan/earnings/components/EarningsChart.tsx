"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";

import { Skeleton } from "@/components/ui/skeleton";

interface EarningsChartProps {
  data?: { date: string; amount: number }[];
  isLoading?: boolean;
}

export function EarningsChart({ data = [], isLoading }: EarningsChartProps) {
  if (isLoading) {
    return <Skeleton className="h-[280px] w-full rounded-xl" />;
  }

  const chartData = data.map((d) => ({
    ...d,
    label: format(parseISO(d.date), "d MMM", { locale: fr }),
  }));

  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11 }}
            interval="preserveStartEnd"
          />
          <YAxis tick={{ fontSize: 11 }} unit=" MAD" />
          <Tooltip
            formatter={(value: number) => [`${value} MAD`, "Revenus"]}
            labelFormatter={(_, payload) =>
              payload?.[0]?.payload?.date
                ? format(parseISO(String(payload[0].payload.date)), "EEEE d MMMM", {
                    locale: fr,
                  })
                : ""
            }
          />
          <Line
            type="monotone"
            dataKey="amount"
            stroke="#E8622A"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
