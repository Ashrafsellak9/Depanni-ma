"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";

import { FAQ_ITEMS, type FaqItem } from "@/components/landing/faqData";
import { cn } from "@/lib/utils";

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none" aria-hidden>
      <path d="M8 2.4v11.2M2.4 8h11.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function FaqAccordion({
  items = FAQ_ITEMS,
  defaultOpen,
}: {
  items?: FaqItem[];
  defaultOpen?: string;
}) {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(defaultOpen ?? items[0]?.id ?? "");
  const duration = reduced ? 0 : 0.28;

  return (
    <Accordion.Root
      type="single"
      collapsible
      value={open}
      onValueChange={setOpen}
      className="w-full"
    >
      {items.map((item) => {
        const isOpen = open === item.id;
        return (
          <Accordion.Item key={item.id} value={item.id} className="border-b border-line">
            <Accordion.Header>
              <Accordion.Trigger
                className={cn(
                  "group flex w-full items-center justify-between gap-6 py-6 text-left",
                  "font-sans text-lg font-medium text-ink",
                )}
              >
                <span>{item.question}</span>
                <PlusIcon className="h-4 w-4 shrink-0 text-ink transition-transform duration-300 ease-out group-hover:rotate-45 group-data-[state=open]:rotate-45" />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content forceMount asChild>
              <motion.div
                initial={false}
                animate={{
                  height: isOpen ? "auto" : 0,
                  opacity: isOpen ? 1 : 0,
                }}
                transition={{ duration, ease: "easeOut" }}
                style={{ overflow: "hidden" }}
                aria-hidden={!isOpen}
                ref={(node) => {
                  if (node) node.inert = !isOpen;
                }}
              >
                <div className="max-w-[62ch] pb-6">
                  {item.lead ? <p className="font-display text-base italic text-ink">{item.lead}</p> : null}
                  <p className={item.lead ? "mt-2 text-base text-ink/70" : "text-base text-ink/70"}>{item.body}</p>
                </div>
              </motion.div>
            </Accordion.Content>
          </Accordion.Item>
        );
      })}
    </Accordion.Root>
  );
}
