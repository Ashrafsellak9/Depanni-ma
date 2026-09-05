import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { AuthSidePanel } from "@/components/auth/AuthSidePanel";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-cream">
      <AuthSidePanel />

      <div className="relative flex min-h-screen flex-1 flex-col">
        <Link
          href="/"
          className="absolute left-4 top-6 z-10 inline-flex min-h-[44px] items-center gap-1.5 text-sm font-medium text-dep-gray transition-colors duration-200 hover:text-navy sm:left-8"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden /> Retour à l&apos;accueil
        </Link>

        <div className="flex min-h-screen flex-1 flex-col items-center justify-center px-4 py-6 sm:px-8">
          <Link
            href="/"
            className="mb-6 font-display text-2xl font-extrabold text-navy lg:hidden"
            aria-label="DEPANNI.ma, retour à la page d'accueil"
          >
            DEPANNI<span className="text-orange">.ma</span>
          </Link>

          <div className="flex w-full max-w-md flex-col items-stretch gap-4">{children}</div>
        </div>
      </div>
    </div>
  );
}
