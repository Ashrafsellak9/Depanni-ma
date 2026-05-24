import { RequestForm } from "@/components/forms/RequestForm";
import { SERVICE_CATEGORIES } from "@/lib/service-categories";

export const metadata = { title: "Nouvelle demande" };

export default function NewRequestPage() {
  const categories = SERVICE_CATEGORIES.map((c) => ({
    id: c.id,
    slug: c.slug,
    nameFr: c.nameFr,
  }));

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-navy">Nouvelle demande</h1>
      <p className="mt-2 text-muted-foreground">
        Décrivez votre problème — les artisans proches recevront votre demande.
      </p>
      <div className="mt-8">
        <RequestForm categories={categories} />
      </div>
    </div>
  );
}
