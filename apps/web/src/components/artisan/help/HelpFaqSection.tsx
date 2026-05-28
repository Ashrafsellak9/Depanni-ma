"use client";

import { AnimatePresence, motion } from "framer-motion";

import { FaqAccordion } from "@/components/artisan/help/FaqAccordion";
import { FAQ_DATA, type HelpCategoryId } from "@/components/artisan/help/artisanHelpData";

type HelpFaqSectionProps = {
  faqTab: HelpCategoryId;
  onTabChange: (tab: HelpCategoryId) => void;
};

export function HelpFaqSection({ faqTab, onTabChange }: HelpFaqSectionProps) {
  const active = FAQ_DATA[faqTab];

  return (
    <div className="mb-6 overflow-hidden rounded-2xl border border-[#E5E0D8] bg-white">
      <div className="flex gap-1 overflow-x-auto border-b border-[#E5E0D8] px-4 pt-4">
        {(Object.entries(FAQ_DATA) as [HelpCategoryId, (typeof FAQ_DATA)[HelpCategoryId]][]).map(
          ([key, cat]) => (
            <button
              key={key}
              type="button"
              onClick={() => onTabChange(key)}
              className={`flex flex-shrink-0 items-center gap-1.5 whitespace-nowrap rounded-t-lg border-b-2 px-3.5 py-2.5 text-[12px] font-medium transition-all ${
                faqTab === key
                  ? "border-[#F05A1A] bg-[rgba(240,90,26,0.04)] text-[#F05A1A]"
                  : "border-transparent text-[#6B7280] hover:text-[#0F1E35]"
              }`}
            >
              <span>{cat.icon}</span>
              {cat.label}
            </button>
          ),
        )}
      </div>

      <div className="p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={faqTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {active.items.map((item, i) => (
              <FaqAccordion key={`${faqTab}-${i}`} question={item.q} answer={item.a} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
