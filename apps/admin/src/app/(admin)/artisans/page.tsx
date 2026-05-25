"use client";

import Link from "next/link";

import { ArtisansTable } from "@/components/artisans/ArtisansTable";

export default function ArtisansPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Artisans</h2>
        <Link href="/artisans/kyc" className="text-sm text-indigo-600 hover:underline">
          File KYC →
        </Link>
      </div>
      <ArtisansTable />
    </div>
  );
}
