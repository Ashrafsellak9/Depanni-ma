import { useQuery } from "@tanstack/react-query";

import { fetchEarnings } from "@/src/services/artisan";

export type ChartPeriod = 7 | 30 | 90;

export function useArtisanEarnings(chartDays: ChartPeriod = 30) {
  return useQuery({
    queryKey: ["artisan-earnings", chartDays],
    queryFn: () => fetchEarnings(chartDays),
  });
}
