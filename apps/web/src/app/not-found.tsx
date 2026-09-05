import Link from "next/link";

import { PublicPageShell } from "@/components/landing/PublicPageShell";
import { DisplayTitle } from "@/components/ui/display-title";

export default function NotFound() {
  return (
    <PublicPageShell>
      <div className="landing-container py-24 text-center">
        <DisplayTitle as="h1" size="display-2">
          Page introuvable
        </DisplayTitle>
        <p className="mx-auto mt-4 max-w-[42ch] text-ink/70">
          Cette page n&apos;existe pas ou a été déplacée.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex min-h-[48px] items-center justify-center rounded-full bg-rust px-7 text-[15px] font-medium text-white transition-all duration-200 hover:-translate-y-px hover:bg-rust-deep"
        >
          Retour à l&apos;accueil
        </Link>
      </div>
    </PublicPageShell>
  );
}
