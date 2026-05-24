"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useArtisanProfile, useUpdateArtisanProfile } from "@/hooks/artisan/useArtisanProfile";
import { getApiErrorMessage } from "@/lib/api";
import { SERVICE_CATEGORIES } from "@/lib/service-categories";

export default function ArtisanProfilePage() {
  const { data: profile, isLoading } = useArtisanProfile();
  const update = useUpdateArtisanProfile();

  const [bio, setBio] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [serviceRadiusKm, setServiceRadiusKm] = useState("15");
  const [zonesText, setZonesText] = useState("");
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([]);

  useEffect(() => {
    if (profile) {
      setBio(profile.bio ?? "");
      setHourlyRate(profile.hourlyRate != null ? String(profile.hourlyRate) : "");
      setServiceRadiusKm(String(profile.serviceRadiusKm));
      setZonesText(profile.zones.join(", "));
      setSelectedSlugs(profile.specialties);
    }
  }, [profile]);

  const toggleSpecialty = (slug: string) => {
    setSelectedSlugs((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
    );
  };

  const onSave = async () => {
    const categoryIds = SERVICE_CATEGORIES.filter((c) =>
      selectedSlugs.includes(c.slug),
    ).map((c) => c.id);

    try {
      await update.mutateAsync({
        bio: bio.trim() || undefined,
        hourlyRate: hourlyRate ? Number(hourlyRate) : undefined,
        serviceRadiusKm: Number(serviceRadiusKm) || 15,
        zones: zonesText
          .split(",")
          .map((z) => z.trim())
          .filter(Boolean),
        specialties: selectedSlugs,
        categoryIds: categoryIds.length ? categoryIds : undefined,
      });
      toast.success("Profil mis à jour");
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-2xl">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-navy">Profil pro</h1>
        <p className="text-muted-foreground">
          {profile?.firstName} {profile?.lastName} · KYC {profile?.kycStatus}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Présentation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <textarea
              id="bio"
              className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Votre expérience, certifications…"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="rate">Tarif horaire (MAD)</Label>
              <Input
                id="rate"
                type="number"
                min={0}
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="radius">Rayon d&apos;intervention (km)</Label>
              <Input
                id="radius"
                type="number"
                min={1}
                max={100}
                value={serviceRadiusKm}
                onChange={(e) => setServiceRadiusKm(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Spécialités</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {SERVICE_CATEGORIES.map((cat) => {
              const on = selectedSlugs.includes(cat.slug);
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => toggleSpecialty(cat.slug)}
                  className={`rounded-full border px-3 py-1 text-sm transition-colors ${
                    on
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-input hover:bg-muted"
                  }`}
                >
                  {cat.nameFr}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Zones couvertes</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            value={zonesText}
            onChange={(e) => setZonesText(e.target.value)}
            placeholder="Casablanca, Maarif, Ain Diab…"
          />
          <p className="mt-2 text-xs text-muted-foreground">Séparez par des virgules</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Photos réalisations</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Upload portfolio — disponible prochainement via l&apos;app mobile.
        </CardContent>
      </Card>

      <Separator />

      <Button onClick={() => void onSave()} disabled={update.isPending}>
        Enregistrer le profil
      </Button>
    </div>
  );
}
