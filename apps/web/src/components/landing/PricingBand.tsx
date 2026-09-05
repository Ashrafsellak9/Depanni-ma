import { DisplayTitle } from "@/components/ui/display-title";

function IconTarif({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" aria-hidden>
      <path
        d="M7.2 11.4c-.4 6.2 1.1 12.8 8.6 13.4 7.2.6 10.4-5.8 10.1-12.2-.3-6.1-4.2-9.8-9.8-9.4C10.4 3.5 7.6 6.2 7.2 11.4Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M13.1 12.2c.3-1.6 1.6-2.4 3.2-2.3 1.8.1 2.6 1.1 2.6 2.3 0 2.4-5.8 2-5.8 4.7 0 1.3 1.2 2.3 3.1 2.3 1.6 0 2.7-.7 3.2-1.9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path d="M16.2 8.2v1.4M16.1 21.2v1.6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function IconDevis({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" aria-hidden>
      <path
        d="M8.2 5.4h12.4l4.8 4.6V26c0 .8-.8 1.6-1.7 1.6H9.6c-1 0-1.8-.7-1.8-1.7V7c0-.9.7-1.6 1.4-1.6Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M20.2 5.8v4.8h4.6" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M11.4 15.2h9.2M11.6 19.4h6.8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function IconClair({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" aria-hidden>
      <path
        d="M7.4 15.8 15.6 6.6c.4-.5 1.4-.4 1.8.2l8.6 9.4c.3.4.1 1.2-.4 1.4l-8.2 3.6c-.4.2-.9.1-1.2-.2l-8.4-4c-.6-.3-.8-1.1-.4-1.2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M12.2 18.4 15 24.8c.2.5.9.7 1.3.3l3.8-4.2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const COLUMNS = [
  {
    icon: IconTarif,
    title: "À partir de 150 MAD",
    text: "Interventions standards. Le tarif exact vous est communiqué avant validation.",
    accent: true,
  },
  {
    icon: IconDevis,
    title: "Devis toujours gratuit",
    text: "Vous décrivez, l'artisan estime, vous choisissez. Aucun engagement.",
    accent: false,
  },
  {
    icon: IconClair,
    title: "Zéro frais caché",
    text: "Le prix affiché est le prix payé. Déplacement inclus dans la zone couverte.",
    accent: false,
  },
] as const;

export function PricingBand() {
  return (
    <section id="tarifs" className="bg-paper-2 py-12 md:py-16" aria-labelledby="pricing-title">
      <DisplayTitle as="h2" size="sm" id="pricing-title" className="sr-only">
        Tarifs indicatifs
      </DisplayTitle>
      <div className="landing-container grid gap-10 md:grid-cols-3 md:gap-12">
        {COLUMNS.map((col) => (
          <div key={col.title} className="flex gap-4">
            <col.icon className="mt-1 h-8 w-8 shrink-0 text-rust" />
            <div>
              {col.accent ? (
                <p className="font-display text-display-2 text-rust">{col.title}</p>
              ) : (
                <p className="font-display text-xl font-semibold text-ink">{col.title}</p>
              )}
              <p className="mt-2 text-sm text-ink/70">{col.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
