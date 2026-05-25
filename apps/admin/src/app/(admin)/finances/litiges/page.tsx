"use client";

import { DisputesList } from "@/components/disputes/DisputesList";

export default function LitigesPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Litiges</h2>
      <p className="text-sm text-slate-500">
        Triés par priorité (montant + ancienneté). Résolution via POST /api/admin/disputes/:id/resolve
      </p>
      <DisputesList />
    </div>
  );
}
