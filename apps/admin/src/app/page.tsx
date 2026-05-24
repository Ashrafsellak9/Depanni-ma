import { Button, Card, CardContent, CardHeader, CardTitle } from "@depanni/ui";

export default function AdminDashboardPage() {
  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">DEPANNI Admin</h1>
          <Button variant="outline" size="sm">
            Déconnexion
          </Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Utilisateurs", value: "—" },
            { label: "Artisans", value: "—" },
            { label: "Missions actives", value: "—" },
            { label: "Revenus (MAD)", value: "—" },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  {stat.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
