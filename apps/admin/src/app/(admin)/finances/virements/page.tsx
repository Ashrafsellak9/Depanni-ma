"use client";

import { PayoutsTable } from "@/components/finances/PayoutsTable";

export default function VirementsPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Virements artisans</h2>
      <p className="text-sm text-slate-500">
        Batch : POST /api/admin/payouts/batch-pending — traite tous les virements PENDING
      </p>
      <PayoutsTable />
    </div>
  );
}
