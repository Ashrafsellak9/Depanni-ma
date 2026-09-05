"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { useId, useState } from "react";

import { FAQ_ITEMS } from "@/components/how-it-works/howItWorksData";
import { SectionTag } from "@/components/landing/SectionTag";
import { DisplayTitle } from "@/components/ui/display-title";
import { WHATSAPP_URL } from "@/lib/siteConstants";
import { cn } from "@/lib/utils";

function FaqItem({
  q,
  a,
  defaultOpen = false,
}: {
  q: string;
  a: string;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();
  const buttonId = useId();

  return (
    <div className="border-b border-dep-border last:border-0">
      <button
        id={buttonId}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex min-h-[48px] w-full items-center justify-between gap-4 py-4 text-left transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-inset"
      >
        <span className="font-sans text-[15px] font-medium text-navy">{q}</span>
        <Plus
          className={cn(
            "h-5 w-5 shrink-0 text-orange transition-transform duration-200",
            open && "rotate-45",
          )}
          aria-hidden
        />
      </button>
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className={cn(
          "grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <p className="pb-5 text-sm leading-relaxed text-dep-gray">{a}</p>
        </div>
      </div>
    </div>
  );
}

export function HowItWorksFaq() {
  return (
    <section id="faq" className="scroll-mt-28 mx-auto max-w-[680px] px-6 py-20">
      <div className="mb-10 text-center">
        <SectionTag>FAQ</SectionTag>
        <DisplayTitle as="h2" size="display-2" className="mt-4">
          Questions fréquentes
        </DisplayTitle>
      </div>
      <div className="rounded-2xl border border-dep-border bg-white px-6">
        {FAQ_ITEMS.map((faq, i) => (
          <FaqItem key={faq.q} q={faq.q} a={faq.a} defaultOpen={i === 0} />
        ))}
      </div>
      <p className="mt-6 text-center text-sm text-dep-gray">
        Une autre question ?{" "}
        <Link
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-orange hover:underline"
        >
          Écrivez-nous sur WhatsApp
        </Link>
      </p>
    </section>
  );
}
