import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = { title: "Admin" };

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-navy">Administration DEPANNI</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {["Utilisateurs", "Artisans", "Jobs", "KYC en attente"].map((label) => (
          <Card key={label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">{label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">—</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
