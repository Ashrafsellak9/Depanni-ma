import { ProfileForm } from "@/components/forms/ProfileForm";

export const metadata = { title: "Profil artisan" };

export default function ArtisanProfilePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-navy">Profil artisan</h1>
      <p className="mt-2 text-muted-foreground">Bio, spécialités, zones et documents KYC</p>
      <div className="mt-8">
        <ProfileForm />
      </div>
    </div>
  );
}
