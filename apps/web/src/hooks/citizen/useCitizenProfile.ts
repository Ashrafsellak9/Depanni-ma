"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api";
import { unwrapApi } from "@/lib/api-types";
import type { CitizenAddress, CitizenProfile } from "@/types/citizen";

export function useCitizenProfile() {
  return useQuery({
    queryKey: ["citizen-profile"],
    queryFn: async () => {
      const res = await api.get("/users/me");
      return unwrapApi<CitizenProfile>(res);
    },
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: {
      firstName?: string;
      lastName?: string;
      avatarUrl?: string;
      locale?: string;
    }) => {
      const res = await api.patch("/users/me", body);
      return unwrapApi<CitizenProfile>(res);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["citizen-profile"] });
    },
  });
}

export function useAddAddress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: {
      label: string;
      street?: string;
      city: string;
      formatted?: string;
      coordinates: { lat: number; lng: number };
      isDefault?: boolean;
    }) => {
      const res = await api.post("/users/me/addresses", body);
      return unwrapApi<{ addresses: CitizenAddress[] }>(res);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["citizen-profile"] });
    },
  });
}

export function useDeleteAddress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (addressId: string) => {
      await api.delete(`/users/me/addresses/${addressId}`);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["citizen-profile"] });
    },
  });
}
