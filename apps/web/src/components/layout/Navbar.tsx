import Link from "next/link";

import { Button } from "@/components/ui/button";
import { AUTH_ROUTES } from "@/lib/auth";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-navy">
          <span className="text-2xl text-primary">DEPANNI</span>
          <span className="text-sm font-normal text-muted-foreground">.ma</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/comment-ca-marche" className="text-sm text-foreground/80 hover:text-primary">
            Comment ça marche
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link href={AUTH_ROUTES.login}>Connexion</Link>
          </Button>
          <Button asChild>
            <Link href={AUTH_ROUTES.register}>S&apos;inscrire</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
