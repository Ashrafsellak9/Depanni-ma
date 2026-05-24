"use client";

import { Loader2, Radio } from "lucide-react";

export function SearchingBanner() {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/5 px-4 py-3">
      <div className="relative flex h-10 w-10 items-center justify-center">
        <Radio className="h-5 w-5 text-primary" />
        <Loader2 className="absolute h-10 w-10 animate-spin text-primary/40" />
      </div>
      <div>
        <p className="font-semibold text-navy">Recherche en cours…</p>
        <p className="text-sm text-muted-foreground">
          Nous contactons les artisans disponibles près de vous. Les offres apparaîtront ici.
        </p>
      </div>
    </div>
  );
}
