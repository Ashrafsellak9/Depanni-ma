import Link from "next/link";
import { ArrowRight, Shield, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AUTH_ROUTES } from "@/lib/auth";

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-surface via-background to-muted py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-primary">
              Services à domicile au Maroc
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-navy md:text-5xl lg:text-6xl">
              Un artisan de confiance,{" "}
              <span className="text-primary">en quelques minutes</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Plomberie, électricité, climatisation — publiez votre demande, recevez des offres
              d&apos;artisans vérifiés près de chez vous.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild>
                <Link href={AUTH_ROUTES.register}>
                  Demander un dépannage
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="navy" asChild>
                <Link href="/comment-ca-marche">Comment ça marche</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="border-primary/20 bg-surface">
            <CardHeader>
              <Zap className="h-10 w-10 text-primary" />
              <CardTitle className="text-navy">Rapide</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              Diffusion géolocalisée : les artisans proches reçoivent votre demande en temps réel.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Shield className="h-10 w-10 text-navy" />
              <CardTitle className="text-navy">Sécurisé</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              Paiement en séquestre, KYC artisans, suivi GPS et chat intégré.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-navy">Transparent</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              Comparez les offres, choisissez votre artisan, payez après validation du travail.
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
