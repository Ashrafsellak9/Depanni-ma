"use client";

import { Briefcase, Star, Wallet } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface StatsCardsProps {
  missionsToday?: number;
  revenueToday?: number;
  rating?: number;
  isLoading?: boolean;
}

export function StatsCards({
  missionsToday = 0,
  revenueToday = 0,
  rating = 0,
  isLoading,
}: StatsCardsProps) {
  const cards = [
    {
      label: "Missions aujourd'hui",
      value: String(missionsToday),
      icon: Briefcase,
      accent: "text-primary",
    },
    {
      label: "Revenus du jour",
      value: `${revenueToday.toFixed(0)} MAD`,
      icon: Wallet,
      accent: "text-success",
    },
    {
      label: "Note moyenne",
      value: rating.toFixed(1),
      icon: Star,
      accent: "text-navy",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <Card
            key={card.label}
            className={cn(
              "overflow-hidden transition-all duration-500 hover:shadow-md",
              "animate-in fade-in slide-in-from-bottom-2",
            )}
            style={{ animationDelay: `${i * 80}ms`, animationFillMode: "backwards" }}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.label}
              </CardTitle>
              <Icon className={cn("h-4 w-4", card.accent)} />
            </CardHeader>
            <CardContent>
              <p className={cn("text-3xl font-bold tabular-nums", card.accent)}>{card.value}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
