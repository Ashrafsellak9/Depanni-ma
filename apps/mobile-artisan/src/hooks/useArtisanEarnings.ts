import { useQuery } from "@tanstack/react-query";

import { fetchEarnings } from "@/src/services/artisan";

export function useArtisanEarnings() {
  return useQuery({
    queryKey: ["artisan-earnings"],
    queryFn: fetchEarnings,
  });
}
