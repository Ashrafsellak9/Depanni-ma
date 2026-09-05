import { Info } from "lucide-react";
import Link from "next/link";

import { ArrowRight } from "@/components/landing/ui/ArrowRight";
import { CoverageMap } from "@/components/sections/coverage-map-dynamic";
import { Accent, DisplayTitle } from "@/components/ui/display-title";
import { AUTH_ROUTES } from "@/lib/auth";

// TODO: Remplacer 224 / 10 / 18 min par les agrégats réels avant production.

export function CoverageSection() {
  return (
    <section id="el-jadida" className="bg-paper-2 py-16 md:py-20" aria-labelledby="coverage-title">
      <div className="landing-container mb-8 grid items-end gap-8 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <p className="font-mono text-xs font-medium uppercase tracking-widest text-ink/65">Couverture</p>
          <DisplayTitle as="h2" size="display-3" id="coverage-title" className="mt-4">
            Nous intervenons dans <Accent>tout</Accent> El Jadida.
          </DisplayTitle>
          <p className="mt-4 max-w-[52ch] text-lg text-ink/70">
            Nos artisans vérifiés couvrent 10 quartiers de la ville, avec un temps moyen
            d&apos;intervention de 18 minutes en urgence.
          </p>
          <p className="mt-4 text-sm text-ink/60">
            Élargissement à Azemmour et Sidi Bouzid prévu Q3 2026.
          </p>
        </div>

        <div className="lg:col-span-6 lg:justify-self-end">
          <div className="grid grid-cols-3 divide-x divide-line">
            <div className="pr-6">
              <div className="font-mono text-3xl text-ink num">224</div>
              <div className="mt-1 text-xs uppercase tracking-widest text-ink/65">Artisans actifs</div>
            </div>
            <div className="px-6">
              <div className="font-mono text-3xl text-ink num">10</div>
              <div className="mt-1 text-xs uppercase tracking-widest text-ink/65">Quartiers couverts</div>
            </div>
            <div className="pl-6">
              <div className="font-mono text-3xl text-ink num">
                18<span className="text-lg text-ink/60">min</span>
              </div>
              <div className="mt-1 text-xs uppercase tracking-widest text-ink/65">Temps moyen</div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-4 md:px-8">
        <CoverageMap className="h-[500px] overflow-hidden rounded-3xl border border-line lg:h-[600px]" />
      </div>

      <div className="landing-container mt-6 flex flex-col items-center justify-between gap-4 text-sm md:flex-row">
        <span className="inline-flex items-center gap-2 text-ink/65">
          <Info className="size-3.5 shrink-0" strokeWidth={1.5} aria-hidden />
          Cliquez sur un quartier pour voir les statistiques détaillées
        </span>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <Link
            href={AUTH_ROUTES.artisanRegister}
            className="group inline-flex items-center gap-2 text-rust-deep"
          >
            Devenir artisan dans votre quartier
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          {/* TODO: Pointer vers la page liste des quartiers quand elle existera. */}
          <Link href="#" className="group inline-flex items-center gap-2 text-rust hover:text-rust-deep">
            Voir la liste complète des quartiers
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
