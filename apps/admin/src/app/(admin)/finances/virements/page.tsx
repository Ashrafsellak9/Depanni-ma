"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@depanni/ui";

export default function VirementsPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Virements</h2>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Payouts artisans</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-slate-500">
          Utilisez l&apos;API <code className="rounded bg-slate-100 px-1">POST /api/admin/payouts</code> pour
          initier les virements. Interface détaillée à brancher sur les endpoints payments admin existants.
        </CardContent>
      </Card>
    </div>
  );
}
