import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@depanni/ui";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-depanni-50 to-white p-8">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-depanni-700">DEPANNI.ma</CardTitle>
          <CardDescription>
            Plateforme de dépannage et services à domicile au Maroc
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-sm text-gray-600">
            Application web citoyen — Next.js 14 App Router
          </p>
          <div className="flex gap-3">
            <Button>Demander un dépannage</Button>
            <Button variant="outline">Se connecter</Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
