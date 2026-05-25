"use client";

import { useQuery } from "@tanstack/react-query";
import { createContext, useContext, useMemo } from "react";

import { fetchOverview } from "@/services/adminApi";

export interface AdminNavBadges {
  missions?: number;
  disputes?: number;
  kyc?: number;
}

const AdminNavBadgesContext = createContext<AdminNavBadges>({});

export function AdminNavBadgesProvider({ children }: { children: React.ReactNode }) {
  const { data } = useQuery({
    queryKey: ["admin", "overview"],
    queryFn: fetchOverview,
    staleTime: 60_000,
    refetchInterval: 30_000,
  });

  const badges = useMemo(
    () => ({
      missions: data?.kpis.missionsInProgress,
      disputes: data?.kpis.disputesOpen,
      kyc: data?.kpis.kycPending,
    }),
    [data],
  );

  return (
    <AdminNavBadgesContext.Provider value={badges}>{children}</AdminNavBadgesContext.Provider>
  );
}

export function useAdminNavBadges() {
  return useContext(AdminNavBadgesContext);
}
