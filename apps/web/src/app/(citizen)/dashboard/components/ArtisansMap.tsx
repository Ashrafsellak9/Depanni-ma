"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { Status, Wrapper } from "@googlemaps/react-wrapper";
import { Star } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { useNearbyArtisans } from "@/hooks/citizen/useNearbyArtisans";
import type { NearbyArtisan } from "@/types/citizen";

interface ArtisansMapProps {
  lat: number | null;
  lng: number | null;
  categoryId?: string;
  className?: string;
  onSelectArtisan?: (artisan: NearbyArtisan) => void;
}

function MapInner({
  lat,
  lng,
  categoryId,
  onSelectArtisan,
}: {
  lat: number;
  lng: number;
  categoryId?: string;
  onSelectArtisan?: (artisan: NearbyArtisan) => void;
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const clustererRef = useRef<MarkerClusterer | null>(null);
  const infoRef = useRef<google.maps.InfoWindow | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const [selected, setSelected] = useState<NearbyArtisan | null>(null);

  const { data: artisans = [], isLoading } = useNearbyArtisans(lat, lng, {
    radius: 20,
    category: categoryId,
    limit: 50,
  });

  const initMap = useCallback(() => {
    if (!mapRef.current || mapInstance.current) return;
    mapInstance.current = new google.maps.Map(mapRef.current, {
      center: { lat, lng },
      zoom: 13,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    });
    infoRef.current = new google.maps.InfoWindow();
    clustererRef.current = new MarkerClusterer({ map: mapInstance.current });
  }, [lat, lng]);

  useEffect(() => {
    initMap();
  }, [initMap]);

  useEffect(() => {
    if (!mapInstance.current) return;
    mapInstance.current.setCenter({ lat, lng });
  }, [lat, lng]);

  useEffect(() => {
    if (!mapInstance.current || !clustererRef.current) return;

    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];
    clustererRef.current.clearMarkers();

    const newMarkers = artisans.map((artisan) => {
      const marker = new google.maps.Marker({
        position: { lat: artisan.lat, lng: artisan.lng },
        title: `${artisan.firstName} ${artisan.lastName}`,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 9,
          fillColor: artisan.badgeVerified ? "#2E7D32" : "#E8622A",
          fillOpacity: 1,
          strokeColor: "#fff",
          strokeWeight: 2,
        },
      });

      marker.addListener("click", () => {
        setSelected(artisan);
        onSelectArtisan?.(artisan);
        const content = `
          <div style="padding:8px;min-width:160px;font-family:sans-serif">
            <strong>${artisan.firstName} ${artisan.lastName}</strong><br/>
            <span>★ ${artisan.rating.toFixed(1)} · ${artisan.distanceKm} km</span>
            ${artisan.hourlyRate ? `<br/><span>${artisan.hourlyRate} MAD/h</span>` : ""}
          </div>`;
        infoRef.current?.setContent(content);
        infoRef.current?.open({ map: mapInstance.current!, anchor: marker });
      });

      return marker;
    });

    markersRef.current = newMarkers;
    clustererRef.current.addMarkers(newMarkers);
  }, [artisans, lat, lng, onSelectArtisan]);

  return (
    <div className="relative h-full min-h-[360px] w-full">
      <div ref={mapRef} className="h-full min-h-[360px] w-full rounded-xl" />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-background/60">
          <Skeleton className="h-8 w-40" />
        </div>
      )}
      {selected && (
        <div className="absolute bottom-4 left-4 right-4 rounded-lg border bg-card p-3 shadow-lg md:left-auto md:right-4 md:w-72">
          <p className="font-semibold text-navy">
            {selected.firstName} {selected.lastName}
          </p>
          <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
            <Star className="h-3.5 w-3.5 fill-primary text-primary" />
            {selected.rating.toFixed(1)} · {selected.distanceKm} km
          </p>
        </div>
      )}
    </div>
  );
}

export function ArtisansMap({ lat, lng, categoryId, className, onSelectArtisan }: ArtisansMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

  if (lat == null || lng == null) {
    return (
      <div className={`flex min-h-[360px] items-center justify-center rounded-xl bg-muted ${className}`}>
        <p className="text-sm text-muted-foreground">Activez la géolocalisation pour voir les artisans</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <Wrapper
        apiKey={apiKey}
        render={(status) => {
          if (status === Status.LOADING) {
            return <Skeleton className="min-h-[360px] w-full rounded-xl" />;
          }
          if (status === Status.FAILURE) {
            return (
              <div className="flex min-h-[360px] items-center justify-center rounded-xl border border-dashed text-sm text-danger">
                Carte indisponible
              </div>
            );
          }
          return (
            <MapInner
              lat={lat}
              lng={lng}
              categoryId={categoryId}
              onSelectArtisan={onSelectArtisan}
            />
          );
        }}
      />
    </div>
  );
}
