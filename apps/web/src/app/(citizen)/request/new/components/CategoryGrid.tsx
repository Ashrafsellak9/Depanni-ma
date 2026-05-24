"use client";

import { cn } from "@/lib/utils";
import { SERVICE_CATEGORIES, type ServiceCategoryItem } from "@/lib/service-categories";

interface CategoryGridProps {
  value?: string;
  onSelect: (category: ServiceCategoryItem) => void;
  error?: string;
}

export function CategoryGrid({ value, onSelect, error }: CategoryGridProps) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {SERVICE_CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const selected = value === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelect(cat)}
              className={cn(
                "group flex flex-col items-center gap-3 rounded-xl border-2 p-4 transition-all hover:shadow-md",
                selected
                  ? "border-primary bg-primary/5 shadow-md"
                  : "border-border bg-card hover:border-primary/40",
              )}
            >
              <div
                className={cn(
                  "flex h-14 w-14 items-center justify-center rounded-2xl transition-colors",
                  selected
                    ? "bg-primary text-primary-foreground"
                    : "bg-primary/10 text-primary group-hover:bg-primary/20",
                )}
              >
                <Icon className="h-7 w-7" strokeWidth={1.75} aria-hidden />
              </div>
              <span
                className={cn(
                  "text-center text-sm font-semibold",
                  selected ? "text-primary" : "text-navy",
                )}
              >
                {cat.nameFr}
              </span>
            </button>
          );
        })}
      </div>
      {error && <p className="text-sm text-danger">{error}</p>}
    </div>
  );
}
