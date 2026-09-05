"use client";

import Link from "next/link";

import { FAQ_ITEMS } from "@/components/landing/faqData";
import { ArrowRight } from "@/components/landing/ui/ArrowRight";
import { FaqAccordion } from "@/components/landing/ui/FaqAccordion";
import { Accent, DisplayTitle } from "@/components/ui/display-title";
import { WHATSAPP_URL } from "@/lib/siteConstants";

export function FaqSection() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.question.replace(/\u00a0/g, " "),
      acceptedAnswer: {
        "@type": "Answer",
        text: `${item.lead} ${item.body}`,
      },
    })),
  };

  return (
    <section id="faq" className="bg-paper py-24 md:py-32" aria-labelledby="faq-title">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="landing-container grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <DisplayTitle as="h2" size="display-2" id="faq-title">
            Les questions qu&apos;on nous pose le <Accent>plus</Accent>.
          </DisplayTitle>
          <p className="mt-4 max-w-[52ch] text-lg text-ink/70">
            Si vous ne trouvez pas votre réponse, notre équipe est joignable 7&nbsp;j/7.
          </p>
          <Link
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-event="faq-support"
            className="group mt-8 inline-flex min-h-[44px] items-center gap-1.5 text-sm font-medium text-ink underline-grow"
          >
            Contacter le support
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
        <div className="lg:col-span-7">
          <FaqAccordion />
        </div>
      </div>
    </section>
  );
}
