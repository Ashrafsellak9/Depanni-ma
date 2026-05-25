"use client";

import { useAdminOverview } from "@/hooks/useAdminOverview";
import { Card, CardContent, CardHeader, CardTitle } from "@depanni/ui";

export default function LitigesPage() {
  const { data, isLoading } = useAdminOverview();

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Litiges</h2>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Paiements en litige</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-slate-500">Chargement…</p>
          ) : (
            <p className="text-3xl font-bold text-red-600">{data?.kpis.disputesOpen ?? 0}</p>
          )}
          <p className="mt-2 text-sm text-slate-500">
            Gestion des remboursements via POST /api/admin/payments/:id/refund
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
