import { Briefcase } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = { title: "Tableau de bord artisan" };

export default function ArtisanDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-navy">Espace artisan</h1>
        <p className="text-muted-foreground">Demandes à proximité et missions en cours</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Disponibilité</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold text-success">En ligne</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Offres en attente</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">—</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Missions actives</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">—</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Solde wallet</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-navy">— MAD</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <Briefcase className="h-8 w-8 text-primary" />
          <CardTitle>Demandes à proximité</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          Activez votre GPS et votre disponibilité pour voir les nouvelles demandes.
        </CardContent>
      </Card>
    </div>
  );
}
