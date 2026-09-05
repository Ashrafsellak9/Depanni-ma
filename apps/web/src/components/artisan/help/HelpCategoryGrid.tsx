"use client";

import { HELP_CATEGORIES, type HelpCategoryId } from "@/components/artisan/help/artisanHelpData";
import { DisplayTitle } from "@/components/ui/display-title";

type HelpCategoryGridProps = {
  activeCategory: HelpCategoryId | null;
  onSelect: (id: HelpCategoryId) => void;
};

export function HelpCategoryGrid({ activeCategory, onSelect }: HelpCategoryGridProps) {
  return (
    <div className="mb-6">
      <DisplayTitle as="h2" size="sm" className="mb-3 text-[16px]">
        Parcourir par thème
      </DisplayTitle>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {HELP_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelect(cat.id)}
            className={`rounded-xl border bg-white p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-sm ${
              activeCategory === cat.id
                ? "border-[#F05A1A] bg-[rgba(240,90,26,0.02)]"
                : "border-[#E5E0D8]"
            }`}
          >
            <div className="mb-2 text-[22px]">{cat.icon}</div>
            <div className="mb-1 text-[12px] font-medium leading-tight text-[#0F1E35]">
              {cat.label}
            </div>
            <div className="text-[10px] text-[#6B7280]">{cat.count} articles</div>
          </button>
        ))}
      </div>
    </div>
  );
}
