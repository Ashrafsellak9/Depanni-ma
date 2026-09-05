import { DisplayTitle } from "@/components/ui/display-title";

export const metadata = { title: "KYC artisans" };

export default function AdminKycPage() {
  return (
    <div>
      <DisplayTitle as="h1" size="sm" className="text-2xl">
        Validation KYC
      </DisplayTitle>
      <p className="mt-2 text-muted-foreground">Artisans en attente de vérification</p>
    </div>
  );
}
