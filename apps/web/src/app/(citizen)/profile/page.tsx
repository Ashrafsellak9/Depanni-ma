"use client";

import { useEffect, useState } from "react";
import { MapPin, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { DisplayTitle } from "@/components/ui/display-title";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAddAddress,
  useCitizenProfile,
  useDeleteAddress,
  useUpdateProfile,
} from "@/hooks/citizen/useCitizenProfile";
import { getApiErrorMessage } from "@/lib/api";

export default function CitizenProfilePage() {
  const { data: profile, isLoading } = useCitizenProfile();
  const updateProfile = useUpdateProfile();
  const addAddress = useAddAddress();
  const deleteAddress = useDeleteAddress();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [locale, setLocale] = useState("fr");
  const [addrLabel, setAddrLabel] = useState("");
  const [addrCity, setAddrCity] = useState("");

  useEffect(() => {
    if (profile) {
      setFirstName(profile.firstName);
      setLastName(profile.lastName);
      setLocale(profile.locale ?? "fr");
    }
  }, [profile]);

  const onSaveProfile = async () => {
    try {
      await updateProfile.mutateAsync({ firstName, lastName, locale });
      toast.success("Profil mis à jour");
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  };

  const onAddAddress = async () => {
    if (!addrLabel.trim() || !addrCity.trim()) {
      toast.error("Libellé et ville requis");
      return;
    }
    try {
      await addAddress.mutateAsync({
        label: addrLabel,
        city: addrCity,
        coordinates: { lat: 33.5731, lng: -7.5898 },
      });
      setAddrLabel("");
      setAddrCity("");
      toast.success("Adresse ajoutée");
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-2xl">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <DisplayTitle as="h1" size="sm" className="text-2xl">
          Profil
        </DisplayTitle>
        <p className="text-muted-foreground">{profile?.email}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informations personnelles</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">Prénom</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Nom</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="locale">Langue</Label>
            <select
              id="locale"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={locale}
              onChange={(e) => setLocale(e.target.value)}
            >
              <option value="fr">Français</option>
              <option value="ar">العربية</option>
            </select>
          </div>
          <Button onClick={() => void onSaveProfile()} disabled={updateProfile.isPending}>
            Enregistrer
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Adresses sauvegardées
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {(profile?.addresses ?? []).length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucune adresse enregistrée.</p>
          ) : (
            <ul className="space-y-2">
              {profile?.addresses.map((addr, idx) => (
                <li
                  key={addr.id ?? `${addr.formatted}-${idx}`}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div>
                    <p className="font-medium text-navy">{addr.label ?? "Adresse"}</p>
                    <p className="text-sm text-muted-foreground">
                      {addr.formatted ?? `${addr.street ?? ""} ${addr.city ?? ""}`.trim()}
                    </p>
                  </div>
                  {addr.id && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteAddress.mutate(addr.id!)}
                      disabled={deleteAddress.isPending}
                    >
                      <Trash2 className="h-4 w-4 text-danger" />
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          )}

          <Separator />

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Libellé</Label>
              <Input
                placeholder="Maison, Bureau…"
                value={addrLabel}
                onChange={(e) => setAddrLabel(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Ville</Label>
              <Input
                placeholder="Casablanca"
                value={addrCity}
                onChange={(e) => setAddrCity(e.target.value)}
              />
            </div>
          </div>
          <Button variant="outline" onClick={() => void onAddAddress()} disabled={addAddress.isPending}>
            Ajouter une adresse
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Préférences</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>Notifications push et e-mail — bientôt disponibles.</p>
          <p>SMS pour les offres urgentes — activé par défaut.</p>
        </CardContent>
      </Card>
    </div>
  );
}
