"use client";

import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";
import { SERVICE_CATEGORIES } from "@/lib/service-categories";
import { cn } from "@/lib/utils";

interface QuickServiceGridProps {
  selectedCategoryId?: string;
  onSelectCategory?: (categoryId: string | undefined) => void;
}

export function QuickServiceGrid({ selectedCategoryId, onSelectCategory }: QuickServiceGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
      {SERVICE_CATEGORIES.map((cat) => {
        const Icon = cat.icon;
        const selected = selectedCategoryId === cat.id;
        return (
          <button
            key={cat.id}
            type="button"
            onClick={() =>
              onSelectCategory?.(selected ? undefined : cat.id)
            }
            className="text-left"
          >
            <Card
              className={cn(
                "transition-shadow hover:shadow-md",
                selected && "ring-2 ring-primary",
              )}
            >
              <CardContent className="flex flex-col items-center gap-2 p-4">
                <div
                  className={cn(
                    "flex h-11 w-11 items-center justify-center rounded-full",
                    selected ? "bg-primary text-white" : "bg-primary/10 text-primary",
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-center text-sm font-medium text-navy">{cat.nameFr}</span>
              </CardContent>
            </Card>
          </button>
        );
      })}
      <Link href="/request/new" className="col-span-2 sm:col-span-1">
        <Card className="h-full border-dashed transition-shadow hover:shadow-md">
          <CardContent className="flex h-full min-h-[100px] flex-col items-center justify-center gap-1 p-4 text-center">
            <span className="text-2xl text-primary">+</span>
            <span className="text-sm font-medium text-navy">Autre service</span>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}
