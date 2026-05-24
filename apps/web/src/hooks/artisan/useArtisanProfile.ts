"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api";
import { unwrapApi } from "@/lib/api-types";
import type { ArtisanProfile } from "@/types/artisan";

export function useArtisanProfile() {
  return useQuery({
    queryKey: ["artisan-profile"],
    queryFn: async () => {
      const res = await api.get("/artisans/me");
      return unwrapApi<ArtisanProfile>(res);
    },
  });
}

export function useUpdateArtisanProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: {
      bio?: string;
      specialties?: string[];
      zones?: string[];
      hourlyRate?: number;
      serviceRadiusKm?: number;
      categoryIds?: string[];
    }) => {
      const res = await api.patch("/artisans/me", body);
      return unwrapApi<ArtisanProfile>(res);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["artisan-profile"] });
    },
  });
}

export function useSetAvailability() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (isAvailable: boolean) => {
      const res = await api.post("/artisans/me/availability", { isAvailable });
      return unwrapApi<{ availabilityStatus: string }>(res);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["artisan-profile"] });
    },
  });
}
