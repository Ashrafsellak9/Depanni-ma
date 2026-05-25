"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";
import { useState } from "react";

const DEFAULT_MESSAGE =
  "7 artisans en attente de validation KYC · 3 litiges ouverts nécessitent votre attention · 2 artisans sous la note minimale (3.5/5)";

function highlightMessage(message: string) {
  return message.replace(
    /(\d+ artisans|\d+ litiges|\d+ artisans sous)/g,
    '<strong class="text-[#F05A1A]">$1</strong>',
  );
}

export function AlertBanner({ message = DEFAULT_MESSAGE }: { message?: string }) {
  const [visible, setVisible] = useState(true);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="mb-5 flex items-center gap-3 rounded-xl border border-[rgba(240,90,26,0.2)] bg-[rgba(240,90,26,0.07)] px-4 py-3"
        >
          <AlertTriangle size={18} className="shrink-0 text-[#F05A1A]" />
          <p
            className="flex-1 text-[12px] text-[#0F1E35]"
            dangerouslySetInnerHTML={{ __html: highlightMessage(message) }}
          />
          <button
            type="button"
            onClick={() => setVisible(false)}
            className="text-[#6B7280] hover:text-[#0F1E35]"
            aria-label="Fermer"
          >
            <X size={16} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
