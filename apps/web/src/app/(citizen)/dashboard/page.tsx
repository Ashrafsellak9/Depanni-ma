import dynamic from "next/dynamic";

const CitizenDashboardClient = dynamic(
  () =>
    import("@/app/(citizen)/dashboard/CitizenDashboardClient").then((m) => m.CitizenDashboardClient),
  { ssr: false, loading: () => <p className="p-8 text-muted-foreground">Chargement…</p> },
);

export const metadata = { title: "Accueil — Citoyen" };

export default function CitizenDashboardPage() {
  return <CitizenDashboardClient />;
}
