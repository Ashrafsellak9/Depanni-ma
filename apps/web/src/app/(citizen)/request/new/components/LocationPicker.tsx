"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Status, Wrapper } from "@googlemaps/react-wrapper";
import { MapPin, Navigation } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useGeolocation } from "@/hooks/useGeolocation";

function PlacesReady({
  onReady,
  children,
}: {
  onReady: () => void;
  children: React.ReactNode;
}) {
  useEffect(() => {
    onReady();
  }, [onReady]);
  return <>{children}</>;
}

interface LocationPickerProps {
  lat?: number;
  lng?: number;
  address: string;
  city: string;
  onChange: (patch: {
    lat: number;
    lng: number;
    address?: string;
    city?: string;
  }) => void;
  errors?: { address?: string; city?: string; lat?: string };
}

function MapPickerInner({
  lat,
  lng,
  onChange,
}: {
  lat: number;
  lng: number;
  onChange: (lat: number, lng: number) => void;
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;
    mapInstance.current = new google.maps.Map(mapRef.current, {
      center: { lat, lng },
      zoom: 15,
      mapTypeControl: false,
      streetViewControl: false,
    });
    markerRef.current = new google.maps.Marker({
      map: mapInstance.current,
      position: { lat, lng },
      draggable: true,
    });
    markerRef.current.addListener("dragend", () => {
      const pos = markerRef.current?.getPosition();
      if (pos) onChange(pos.lat(), pos.lng());
    });
  }, [lat, lng, onChange]);

  useEffect(() => {
    if (!mapInstance.current || !markerRef.current) return;
    const pos = { lat, lng };
    mapInstance.current.setCenter(pos);
    markerRef.current.setPosition(pos);
  }, [lat, lng]);

  return <div ref={mapRef} className="h-[220px] w-full rounded-xl" />;
}

export function LocationPicker({
  lat,
  lng,
  address,
  city,
  onChange,
  errors,
}: LocationPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const geo = useGeolocation();
  const [placesReady, setPlacesReady] = useState(false);

  const effectiveLat = lat ?? geo.lat ?? 33.5731;
  const effectiveLng = lng ?? geo.lng ?? -7.5898;

  const applyGeo = useCallback(() => {
    geo.refresh();
  }, [geo]);

  useEffect(() => {
    if (geo.lat != null && geo.lng != null && lat == null) {
      onChange({ lat: geo.lat, lng: geo.lng });
    }
  }, [geo.lat, geo.lng, lat, onChange]);

  useEffect(() => {
    if (!placesReady || !inputRef.current || !window.google?.maps?.places) return;
    const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
      componentRestrictions: { country: "ma" },
      fields: ["formatted_address", "geometry", "address_components"],
    });
    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (!place.geometry?.location) return;
      const newLat = place.geometry.location.lat();
      const newLng = place.geometry.location.lng();
      let newCity = city;
      for (const c of place.address_components ?? []) {
        if (c.types.includes("locality")) newCity = c.long_name;
      }
      onChange({
        lat: newLat,
        lng: newLng,
        address: place.formatted_address ?? address,
        city: newCity,
      });
    });
  }, [placesReady, address, city, onChange]);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

  return (
    <div className="space-y-4">
      <Button type="button" variant="outline" size="sm" onClick={applyGeo} disabled={geo.loading}>
        <Navigation className="mr-2 h-4 w-4" />
        {geo.loading ? "Localisation…" : "Utiliser ma position"}
      </Button>

      <div className="space-y-2">
        <Label htmlFor="address-search">Rechercher une adresse</Label>
        <Input
          id="address-search"
          ref={inputRef}
          placeholder="Maarif, Casablanca…"
          defaultValue={address}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="address">Adresse</Label>
          <Input
            id="address"
            value={address}
            onChange={(e) => onChange({ lat: effectiveLat, lng: effectiveLng, address: e.target.value })}
          />
          {errors?.address && <p className="text-sm text-danger">{errors.address}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="city">Ville</Label>
          <Input
            id="city"
            value={city}
            onChange={(e) => onChange({ lat: effectiveLat, lng: effectiveLng, city: e.target.value })}
          />
          {errors?.city && <p className="text-sm text-danger">{errors.city}</p>}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border">
        <Wrapper
          apiKey={apiKey}
          libraries={["places"]}
          render={(status) => {
            if (status === Status.LOADING) return <Skeleton className="h-[220px] w-full" />;
            if (status === Status.FAILURE) {
              return (
                <div className="flex h-[220px] items-center justify-center bg-muted text-sm">
                  <MapPin className="mr-2 h-4 w-4" />
                  Carte indisponible — saisissez l&apos;adresse manuellement
                </div>
              );
            }
            return (
              <PlacesReady onReady={() => setPlacesReady(true)}>
                <MapPickerInner
                  lat={effectiveLat}
                  lng={effectiveLng}
                  onChange={(la, ln) => onChange({ lat: la, lng: ln })}
                />
              </PlacesReady>
            );
          }}
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Déplacez le repère pour affiner l&apos;emplacement ({effectiveLat.toFixed(5)},{" "}
        {effectiveLng.toFixed(5)})
      </p>
    </div>
  );
}
