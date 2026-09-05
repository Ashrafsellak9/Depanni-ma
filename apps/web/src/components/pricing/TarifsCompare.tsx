import { CheckMark } from "@/components/landing/ui/CheckMark";
import {
  COMPARE_SECTIONS,
  type CompareCell,
} from "@/components/pricing/tarifsData";
import { Accent, DisplayTitle } from "@/components/ui/display-title";
import { cn } from "@/lib/utils";

function CrossMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none" aria-hidden>
      <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function CellValue({ cell, dark }: { cell: CompareCell; dark?: boolean }) {
  if (cell.kind === "check") {
    return (
      <span className="inline-flex justify-center" aria-label="Inclus">
        <CheckMark className="h-4 w-4 text-rust" />
      </span>
    );
  }
  if (cell.kind === "cross") {
    return (
      <span className="inline-flex justify-center" aria-label="Non inclus">
        <CrossMark className={cn("h-4 w-4", dark ? "text-white/30" : "text-ink/30")} />
      </span>
    );
  }
  return <span className="num font-mono text-sm text-ink">{cell.value}</span>;
}

const PLANS = ["Standard", "Premium", "Pro"] as const;

export function TarifsCompare() {
  return (
    <section className="bg-paper py-20 md:py-28">
      <div className="landing-container">
        <DisplayTitle as="h2" size="display-2" className="max-w-[18ch]">
          Comparez les <Accent>trois</Accent> formules.
        </DisplayTitle>

        <div className="mx-auto mt-12 hidden max-w-5xl overflow-hidden rounded-3xl border border-line md:block">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-line">
                <th className="py-4 pl-6 text-left font-mono text-xs uppercase tracking-widest text-ink/50">
                  Fonctionnalité
                </th>
                <th className="py-4 text-center font-display text-base font-semibold text-ink">
                  Standard
                </th>
                <th className="rounded-t-lg bg-rust/5 py-4 text-center font-display text-base font-semibold text-ink">
                  Premium
                </th>
                <th className="py-4 text-center font-display text-base font-semibold text-ink">
                  Pro
                </th>
              </tr>
            </thead>
            <tbody>
              {COMPARE_SECTIONS.map((section) => (
                <SectionRows key={section.title} section={section} />
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-10 grid gap-4 md:hidden">
          {PLANS.map((plan) => (
            <MobilePlanCard key={plan} plan={plan} />
          ))}
        </div>
      </div>
    </section>
  );
}

function SectionRows({ section }: { section: (typeof COMPARE_SECTIONS)[number] }) {
  return (
    <>
      <tr className="bg-paper-2">
        <td
          colSpan={4}
          className="py-3 pl-6 font-mono text-xs uppercase tracking-widest text-ink/60"
        >
          {section.title}
        </td>
      </tr>
      {section.rows.map((row) => (
        <tr
          key={row.feature}
          className="border-b border-line/40 even:bg-paper-2/40 transition-colors hover:bg-rust/[0.02]"
        >
          <td className="py-4 pl-6 text-sm text-ink/80">{row.feature}</td>
          <td className="py-4 text-center font-mono text-sm text-ink">
            <CellValue cell={row.standard} />
          </td>
          <td className="bg-rust/5 py-4 text-center font-mono text-sm text-ink">
            <CellValue cell={row.premium} />
          </td>
          <td className="py-4 text-center font-mono text-sm text-ink">
            <CellValue cell={row.pro} />
          </td>
        </tr>
      ))}
    </>
  );
}

function MobilePlanCard({ plan }: { plan: (typeof PLANS)[number] }) {
  const key = plan === "Standard" ? "standard" : plan === "Premium" ? "premium" : "pro";
  return (
    <article
      className={cn(
        "rounded-3xl border border-line bg-paper p-6",
        plan === "Premium" && "border-rust/30 bg-rust/5",
      )}
    >
      <h3 className="font-display text-xl font-semibold text-ink">{plan}</h3>
      <div className="mt-4 space-y-5">
        {COMPARE_SECTIONS.map((section) => (
          <div key={section.title}>
            <p className="mb-2 text-[11px] font-medium uppercase tracking-widest text-ink/50">
              {section.title}
            </p>
            <ul className="space-y-2">
              {section.rows.map((row) => (
                <li key={row.feature} className="flex items-center justify-between gap-3">
                  <span className="text-sm text-ink/70">{row.feature}</span>
                  <CellValue cell={row[key]} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </article>
  );
}
