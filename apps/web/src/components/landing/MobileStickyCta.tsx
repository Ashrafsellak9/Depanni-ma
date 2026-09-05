"use client";

import { useEffect, useState } from "react";

import { ArrowRight } from "@/components/landing/ui/ArrowRight";
import { RequestCta } from "@/components/landing/ui/RequestCta";
import { cn } from "@/lib/utils";

export function MobileStickyCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 560);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-line/60 bg-paper/95 p-3 transition-transform duration-300 md:hidden",
        visible ? "translate-y-0" : "translate-y-full",
      )}
    >
      <RequestCta event="mobile-sticky-request" className="h-14 w-full text-base">
        Faire une demande
        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      </RequestCta>
    </div>
  );
}
