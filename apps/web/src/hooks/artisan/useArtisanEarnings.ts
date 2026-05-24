"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api";
import { unwrapApi } from "@/lib/api-types";
import type { ArtisanEarnings, ArtisanPayout } from "@/types/artisan";

export function useArtisanEarnings() {
  return useQuery({
    queryKey: ["artisan-earnings"],
    queryFn: async () => {
      const res = await api.get("/artisans/me/earnings");
      return unwrapApi<ArtisanEarnings>(res);
    },
  });
}

export function useRequestPayout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: { amount: number; bankName: string; iban: string }) => {
      const res = await api.post("/artisans/me/payout-request", body);
      return unwrapApi<ArtisanPayout>(res);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["artisan-earnings"] });
    },
  });
}
