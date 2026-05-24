"use client";

import { useEffect, useRef } from "react";
import { Status, Wrapper } from "@googlemaps/react-wrapper";

import { Skeleton } from "@/components/ui/skeleton";
import { useArtisanTracking } from "@/hooks/citizen/useArtisanTracking";

interface TrackingMapProps {
  missionId: string | undefined;
  jobLat: number;
  jobLng: number;
  enabled: boolean;
  className?: string;
}

function TrackingMapInner({
  missionId,
  jobLat,
  jobLng,
  enabled,
}: {
  missionId: string;
  jobLat: number;
  jobLng: number;
  enabled: boolean;
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const destinationMarker = useRef<google.maps.Marker | null>(null);
  const artisanMarker = useRef<google.maps.Marker | null>(null);

  const { position, eta, arrived } = useArtisanTracking(missionId, enabled);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;
    mapInstance.current = new google.maps.Map(mapRef.current, {
      center: { lat: jobLat, lng: jobLng },
      zoom: 14,
      mapTypeControl: false,
      streetViewControl: false,
    });
    destinationMarker.current = new google.maps.Marker({
      map: mapInstance.current,
      position: { lat: jobLat, lng: jobLng },
      title: "Votre adresse",
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: "#1B2B4B",
        fillOpacity: 1,
        strokeColor: "#fff",
        strokeWeight: 2,
      },
    });
    artisanMarker.current = new google.maps.Marker({
      map: mapInstance.current,
      position: { lat: jobLat, lng: jobLng },
      title: "Artisan",
      icon: {
        path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
        scale: 6,
        fillColor: "#E8622A",
        fillOpacity: 1,
        strokeColor: "#fff",
        strokeWeight: 1,
        rotation: position?.bearing ?? 0,
      },
    });
  }, [jobLat, jobLng, position?.bearing]);

  useEffect(() => {
    if (!artisanMarker.current || !position) return;
    artisanMarker.current.setPosition({ lat: position.lat, lng: position.lng });
    if (position.bearing != null) {
      const icon = artisanMarker.current.getIcon();
      if (typeof icon === "object" && icon) {
        artisanMarker.current.setIcon({ ...icon, rotation: position.bearing });
      }
    }
    mapInstance.current?.panTo({ lat: position.lat, lng: position.lng });
  }, [position]);

  return (
    <div className="relative">
      <div ref={mapRef} className="h-[280px] w-full rounded-xl md:h-[320px]" />
      {(eta || arrived) && (
        <div className="absolute bottom-3 left-3 rounded-lg bg-card/95 px-3 py-2 text-sm shadow">
          {arrived ? (
            <span className="font-medium text-success">Artisan arrivé</span>
          ) : eta ? (
            <span>
              ETA ~{eta.durationMinutes} min · {eta.distanceKm} km
            </span>
          ) : null}
        </div>
      )}
    </div>
  );
}

export function TrackingMap({ missionId, jobLat, jobLng, enabled, className }: TrackingMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

  if (!missionId || !enabled) {
    return (
      <div className={`flex h-[280px] items-center justify-center rounded-xl bg-muted text-sm text-muted-foreground ${className}`}>
        Suivi disponible une fois la mission acceptée
      </div>
    );
  }

  return (
    <div className={className}>
      <Wrapper
        apiKey={apiKey}
        render={(status) => {
          if (status === Status.LOADING) {
            return <Skeleton className="h-[280px] w-full rounded-xl" />;
          }
          if (status === Status.FAILURE) {
            return (
              <div className="flex h-[280px] items-center justify-center rounded-xl border border-dashed text-sm text-danger">
                Carte indisponible
              </div>
            );
          }
          return (
            <TrackingMapInner
              missionId={missionId}
              jobLat={jobLat}
              jobLng={jobLng}
              enabled={enabled}
            />
          );
        }}
      />
    </div>
  );
}
