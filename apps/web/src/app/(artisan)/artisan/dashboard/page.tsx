import dynamic from "next/dynamic";

const ArtisanDashboardClient = dynamic(
  () =>
    import("@/app/(artisan)/artisan/dashboard/ArtisanDashboardClient").then(
      (m) => m.ArtisanDashboardClient,
    ),
  { ssr: false, loading: () => <p className="p-8 text-muted-foreground">Chargement…</p> },
);

export const metadata = { title: "Tableau de bord — Artisan" };

export default function ArtisanDashboardPage() {
  return <ArtisanDashboardClient />;
}
