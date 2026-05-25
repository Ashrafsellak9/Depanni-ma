import Link from "next/link";

import { PublicPageShell } from "@/components/landing/PublicPageShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AUTH_ROUTES } from "@/lib/auth";

export const dynamic = "force-static";

export const metadata = {
  title: "Tarifs",
  description: "Transparence des tarifs DEPANNI.ma — commission, abonnements artisans.",
};

const PLANS = [
  { name: "Standard", price: "15 %", detail: "Commission par mission" },
  { name: "Premium", price: "199 MAD/mois", detail: "Commission 10 %" },
  { name: "Pro", price: "Sur devis", detail: "Commission 7 %, support prioritaire" },
];

export default function PrixPage() {
  return (
    <PublicPageShell>
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-navy">Tarifs transparents</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        Les citoyens publient gratuitement. Les artisans choisissent leur formule selon leur volume.
      </p>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {PLANS.map((plan) => (
          <Card key={plan.name}>
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-primary">{plan.price}</p>
              <p className="mt-2 text-sm text-muted-foreground">{plan.detail}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Button className="mt-10" asChild>
        <Link href={AUTH_ROUTES.newRequest}>Créer un compte</Link>
      </Button>
    </div>
    </PublicPageShell>
  );
}
