"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useState } from "react";

import { SectionTag } from "@/components/landing/SectionTag";
import { FAQ_ITEMS } from "@/components/how-it-works/howItWorksData";

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-dep-border last:border-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-5 text-left"
        aria-expanded={open}
      >
        <span className="pr-4 font-dm text-[15px] font-semibold text-navy">{q}</span>
        <motion.div animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.2 }}>
          <Plus size={18} className="shrink-0 text-orange" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-[14px] leading-[1.7] text-dep-gray">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function HowItWorksFaq() {
  return (
    <section className="mx-auto max-w-[680px] px-6 py-20">
      <div className="mb-10 text-center">
        <SectionTag>FAQ</SectionTag>
        <h2 className="mt-4 font-syne text-[36px] font-extrabold tracking-[-1px] text-navy">
          Questions fréquentes
        </h2>
      </div>
      <div className="rounded-2xl border border-dep-border bg-white px-6">
        {FAQ_ITEMS.map((faq) => (
          <FaqItem key={faq.q} q={faq.q} a={faq.a} />
        ))}
      </div>
    </section>
  );
}
