"use client";

import { useMemo, useState } from "react";
import { Check, Star, X } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAcceptOffer, useRejectOffer } from "@/hooks/citizen/useOfferActions";
import type { CitizenOffer } from "@/types/citizen";

type SortKey = "price" | "rating" | "eta";

interface OffersListProps {
  jobId: string;
  offers: CitizenOffer[] | undefined;
  isLoading?: boolean;
  canRespond?: boolean;
}

export function OffersList({ jobId, offers, isLoading, canRespond = true }: OffersListProps) {
  const [sort, setSort] = useState<SortKey>("price");
  const accept = useAcceptOffer(jobId);
  const reject = useRejectOffer(jobId);

  const pending = useMemo(
    () => (offers ?? []).filter((o) => o.status === "PENDING"),
    [offers],
  );

  const sorted = useMemo(() => {
    const list = [...pending];
    list.sort((a, b) => {
      if (sort === "price") return a.price - b.price;
      if (sort === "eta") return (a.etaMinutes ?? 999) - (b.etaMinutes ?? 999);
      const ra = a.artisan?.rating ?? 0;
      const rb = b.artisan?.rating ?? 0;
      return rb - ra;
    });
    return list;
  }, [pending, sort]);

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-28 w-full" />
      </div>
    );
  }

  if (pending.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-4">
        Aucune offre en attente. Les artisans vous répondront bientôt.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {(
          [
            { key: "price" as const, label: "Prix" },
            { key: "rating" as const, label: "Note" },
            { key: "eta" as const, label: "Délai" },
          ] as const
        ).map(({ key, label }) => (
          <Button
            key={key}
            type="button"
            size="sm"
            variant={sort === key ? "default" : "outline"}
            onClick={() => setSort(key)}
          >
            {label}
          </Button>
        ))}
      </div>

      <ul className="space-y-3">
        {sorted.map((offer) => {
          const artisan = offer.artisan;
          const initials = artisan
            ? `${artisan.firstName[0]}${artisan.lastName[0]}`
            : "??";
          const busy = accept.isPending || reject.isPending;

          return (
            <li key={offer.id}>
              <Card>
                <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                  <div className="flex min-w-0 flex-1 gap-3">
                    <Avatar>
                      {artisan?.avatar && <AvatarImage src={artisan.avatar} alt="" />}
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-navy">
                        {artisan ? `${artisan.firstName} ${artisan.lastName}` : "Artisan"}
                      </p>
                      <p className="text-lg font-bold text-primary">{offer.price} MAD</p>
                      <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                        {offer.etaMinutes != null && <span>~{offer.etaMinutes} min</span>}
                        {artisan?.rating != null && (
                          <span className="flex items-center gap-0.5">
                            <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                            {artisan.rating.toFixed(1)}
                          </span>
                        )}
                      </div>
                      {offer.message && (
                        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{offer.message}</p>
                      )}
                    </div>
                  </div>
                  {canRespond && (
                    <div className="flex shrink-0 gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        disabled={busy}
                        onClick={() => reject.mutate(offer.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        disabled={busy}
                        onClick={() => accept.mutate(offer.id)}
                      >
                        <Check className="mr-1 h-4 w-4" />
                        Accepter
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
