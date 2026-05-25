"use client";

import { useQuery } from "@tanstack/react-query";

import { AdminGuard } from "@/components/layout/AdminGuard";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { AdminTopbar } from "@/components/layout/AdminTopbar";
import { fetchOverview } from "@/services/adminApi";

export default function AdminAppLayout({ children }: { children: React.ReactNode }) {
  const { data } = useQuery({
    queryKey: ["admin", "overview"],
    queryFn: fetchOverview,
    staleTime: 60_000,
  });

  const badges = {
    missions: data?.kpis.missionsInProgress,
    disputes: data?.kpis.disputesOpen,
    kyc: data?.kpis.kycPending,
  };

  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-slate-50">
        <AdminSidebar counts={badges} />
        <div className="flex flex-1 flex-col overflow-hidden">
          <AdminTopbar title="DEPANNI Admin" />
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    </AdminGuard>
  );
}
