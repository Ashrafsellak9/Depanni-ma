"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MapPin, Navigation } from "lucide-react";

import { GoogleMap } from "@/components/maps/GoogleMap";
import { MapStatus } from "@/components/maps/GoogleMapProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGeolocation } from "@/hooks/useGeolocation";

export interface LocationPickerProps {
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
  errors?: { address?: string; city?: string };
}

function MapPickerInner({
  lat,
  lng,
  onMapClick,
}: {
  lat: number;
  lng: number;
  onMapClick: (la: number, ln: number) => void;
}) {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);

  useEffect(() => {
    if (!map) return;
    markerRef.current = new google.maps.Marker({
      map,
      position: { lat, lng },
      draggable: true,
    });
    markerRef.current.addListener("dragend", () => {
      const pos = markerRef.current?.getPosition();
      if (pos) onMapClick(pos.lat(), pos.lng());
    });
    map.addListener("click", (e: google.maps.MapMouseEvent) => {
      if (e.latLng) onMapClick(e.latLng.lat(), e.latLng.lng());
    });
  }, [map, onMapClick, lat, lng]);

  useEffect(() => {
    if (!map || !markerRef.current) return;
    const pos = { lat, lng };
    map.setCenter(pos);
    markerRef.current.setPosition(pos);
  }, [lat, lng, map]);

  return (
    <GoogleMap center={{ lat, lng }} zoom={15} onLoad={setMap} className="h-[220px]" />
  );
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
  const geo = useGeolocation({ watch: false, fallbackIp: true });
  const [placesReady, setPlacesReady] = useState(false);

  const effectiveLat = lat ?? geo.lat ?? 33.5731;
  const effectiveLng = lng ?? geo.lng ?? -7.5898;

  const handleMapClick = useCallback(
    (la: number, ln: number) => {
      onChange({ lat: la, lng: ln });
    },
    [onChange],
  );

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
    const listener = autocomplete.addListener("place_changed", () => {
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
    return () => {
      google.maps.event.removeListener(listener);
    };
  }, [placesReady, address, city, onChange]);

  useEffect(() => {
    if (window.google?.maps?.places) setPlacesReady(true);
  }, []);

  return (
    <div className="space-y-4">
      <Button type="button" variant="outline" size="sm" onClick={geo.refresh} disabled={geo.loading}>
        <Navigation className="mr-2 h-4 w-4" />
        {geo.loading ? "Localisation…" : "Utiliser ma position"}
      </Button>
      {geo.source === "ip" && (
        <p className="text-xs text-muted-foreground">Position estimée via IP (GPS refusé)</p>
      )}

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
            onChange={(e) =>
              onChange({ lat: effectiveLat, lng: effectiveLng, address: e.target.value })
            }
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
        <MapStatus
          error={
            <div className="flex h-[220px] items-center justify-center bg-muted text-sm">
              <MapPin className="mr-2 h-4 w-4" />
              Carte indisponible
            </div>
          }
        >
          <MapPickerInner lat={effectiveLat} lng={effectiveLng} onMapClick={handleMapClick} />
        </MapStatus>
      </div>
      <p className="text-xs text-muted-foreground">
        Cliquez sur la carte ou déplacez le repère ({effectiveLat.toFixed(5)}, {effectiveLng.toFixed(5)})
      </p>
    </div>
  );
}
