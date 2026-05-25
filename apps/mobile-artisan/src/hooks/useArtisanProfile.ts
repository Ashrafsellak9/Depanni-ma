import { useQuery } from "@tanstack/react-query";

import { fetchArtisanProfile } from "@/src/services/artisan";

export function useArtisanProfile() {
  return useQuery({
    queryKey: ["artisan-profile"],
    queryFn: fetchArtisanProfile,
  });
}
