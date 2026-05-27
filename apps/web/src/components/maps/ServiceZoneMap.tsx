"use client";

import { useEffect, useRef } from "react";

import { GoogleMap } from "@/components/maps/GoogleMap";
import { MapStatus } from "@/components/maps/GoogleMapProvider";
import { DEFAULT_MAP_CENTER } from "@/lib/mapsConfig";

interface ServiceZoneMapProps {
  center?: google.maps.LatLngLiteral;
  radiusKm: number;
  className?: string;
  onCenterChange?: (lat: number, lng: number) => void;
}

function ZoneMapInner({
  center,
  radiusKm,
  onCenterChange,
}: {
  center: google.maps.LatLngLiteral;
  radiusKm: number;
  onCenterChange?: (lat: number, lng: number) => void;
}) {
  const circleRef = useRef<google.maps.Circle | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);

  const handleMapLoad = (map: google.maps.Map) => {
    markerRef.current = new google.maps.Marker({
      map,
      position: center,
      draggable: true,
      title: "Votre zone d'intervention",
    });

    circleRef.current = new google.maps.Circle({
      map,
      center,
      radius: radiusKm * 1000,
      fillColor: "#F05A1A",
      fillOpacity: 0.12,
      strokeColor: "#F05A1A",
      strokeOpacity: 0.6,
      strokeWeight: 2,
    });

    markerRef.current.addListener("dragend", () => {
      const pos = markerRef.current?.getPosition();
      if (!pos) return;
      const lat = pos.lat();
      const lng = pos.lng();
      circleRef.current?.setCenter({ lat, lng });
      onCenterChange?.(lat, lng);
    });

    map.addListener("click", (e: google.maps.MapMouseEvent) => {
      const lat = e.latLng?.lat();
      const lng = e.latLng?.lng();
      if (lat == null || lng == null) return;
      markerRef.current?.setPosition({ lat, lng });
      circleRef.current?.setCenter({ lat, lng });
      onCenterChange?.(lat, lng);
    });
  };

  useEffect(() => {
    circleRef.current?.setRadius(radiusKm * 1000);
  }, [radiusKm]);

  useEffect(() => {
    markerRef.current?.setPosition(center);
    circleRef.current?.setCenter(center);
  }, [center]);

  return (
    <GoogleMap
      center={center}
      zoom={12}
      className="h-[200px] overflow-hidden rounded-xl border border-dep-border"
      onLoad={handleMapLoad}
    />
  );
}

export function ServiceZoneMap({
  center = DEFAULT_MAP_CENTER,
  radiusKm,
  className,
  onCenterChange,
}: ServiceZoneMapProps) {
  return (
    <div className={className}>
      <MapStatus
        error={
          <div className="flex h-[200px] items-center justify-center rounded-xl border border-dashed border-dep-border bg-cream p-4 text-center text-[12px] text-dep-gray">
            Carte indisponible — ajoutez GOOGLE_MAPS_API_KEY dans le .env racine puis redémarrez
            pnpm dev
          </div>
        }
      >
        <ZoneMapInner center={center} radiusKm={radiusKm} onCenterChange={onCenterChange} />
      </MapStatus>
      <p className="mt-2 text-[11px] text-dep-gray">
        Déplacez le repère ou cliquez sur la carte pour définir le centre de votre zone.
      </p>
    </div>
  );
}
