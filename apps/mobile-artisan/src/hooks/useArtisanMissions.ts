import { useQuery } from "@tanstack/react-query";

import { fetchMissions } from "@/src/services/artisan";

export function useArtisanMissions(params?: {
  status?: string;
  search?: string;
  limit?: number;
}) {
  return useQuery({
    queryKey: ["artisan-missions", params],
    queryFn: () => fetchMissions({ ...params, page: 1 }),
  });
}
