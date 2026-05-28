"use client";

import { motion } from "framer-motion";

import type { SearchableFaqItem } from "@/components/artisan/help/artisanHelpData";

type HelpSearchResultsProps = {
  search: string;
  results: SearchableFaqItem[];
  onSelect: (categoryId: SearchableFaqItem["categoryId"]) => void;
  onContactSupport: () => void;
};

export function HelpSearchResults({
  search,
  results,
  onSelect,
  onContactSupport,
}: HelpSearchResultsProps) {
  if (search.length <= 2) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-5 rounded-2xl border border-[#E5E0D8] bg-white p-4"
    >
      <div className="mb-3 text-[12px] text-[#6B7280]">
        {results.length} résultat{results.length !== 1 ? "s" : ""} pour &ldquo;{search}&rdquo;
      </div>

      {results.length > 0 ? (
        results.map((r, i) => (
          <button
            key={`${r.categoryId}-${i}`}
            type="button"
            onClick={() => onSelect(r.categoryId)}
            className="-mx-3 flex w-full items-start gap-3 rounded-lg border-b border-[rgba(229,224,216,0.5)] px-3 py-3 text-left transition-colors last:border-0 hover:bg-[#FAF7F2]"
          >
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[rgba(240,90,26,0.1)] text-[14px]">
              {r.icon}
            </div>
            <div>
              <div className="text-[13px] font-medium text-[#0F1E35]">{r.q}</div>
              <div className="mt-0.5 line-clamp-1 text-[11px] text-[#6B7280]">{r.a}</div>
              <div className="mt-1 text-[10px] text-[#F05A1A]">{r.category}</div>
            </div>
          </button>
        ))
      ) : (
        <div className="py-6 text-center">
          <div className="mb-2 text-[28px]">🔍</div>
          <div className="text-[13px] text-[#6B7280]">
            Aucun résultat — essayez d&apos;autres mots-clés
          </div>
          <button
            type="button"
            onClick={onContactSupport}
            className="mt-2 text-[12px] text-[#F05A1A]"
          >
            Contacter le support →
          </button>
        </div>
      )}
    </motion.div>
  );
}
