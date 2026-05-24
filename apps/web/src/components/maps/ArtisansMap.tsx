"use client";

import { useEffect, useRef, useState } from "react";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { Star } from "lucide-react";

import { GoogleMap } from "@/components/maps/GoogleMap";
import { MapStatus } from "@/components/maps/GoogleMapProvider";
import {
  buildArtisanInfoHtml,
  createArtisanCategoryIcon,
  getCategorySlug,
} from "@/components/maps/markers";
import { Skeleton } from "@/components/ui/skeleton";
import { useNearbyArtisans } from "@/hooks/citizen/useNearbyArtisans";
import type { NearbyArtisan } from "@/types/citizen";

export interface ArtisansMapProps {
  lat: number | null;
  lng: number | null;
  categoryId?: string;
  className?: string;
  onSelectArtisan?: (artisan: NearbyArtisan) => void;
}

function ArtisansMapInner({
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
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const clustererRef = useRef<MarkerClusterer | null>(null);
  const infoRef = useRef<google.maps.InfoWindow | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const [selected, setSelected] = useState<NearbyArtisan | null>(null);

  const { data: artisans = [], isLoading } = useNearbyArtisans(lat, lng, {
    radius: 20,
    category: categoryId,
    limit: 50,
  });

  useEffect(() => {
    if (!map) return;
    infoRef.current = new google.maps.InfoWindow();
    clustererRef.current = new MarkerClusterer({ map });
    map.setCenter({ lat, lng });
  }, [map, lat, lng]);

  useEffect(() => {
    if (!map || !clustererRef.current) return;

    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];
    clustererRef.current.clearMarkers();

    const newMarkers = artisans.map((artisan) => {
      const slug = getCategorySlug(artisan);
      const marker = new google.maps.Marker({
        position: { lat: artisan.lat, lng: artisan.lng },
        title: `${artisan.firstName} ${artisan.lastName}`,
        icon: createArtisanCategoryIcon(slug, artisan.badgeVerified),
      });

      marker.addListener("click", () => {
        setSelected(artisan);
        onSelectArtisan?.(artisan);
        infoRef.current?.setContent(
          buildArtisanInfoHtml({
            firstName: artisan.firstName,
            lastName: artisan.lastName,
            avatarUrl: artisan.avatarUrl,
            rating: artisan.rating,
            distanceKm: artisan.distanceKm,
            hourlyRate: artisan.hourlyRate,
          }),
        );
        infoRef.current?.open({ map, anchor: marker });
      });

      return marker;
    });

    markersRef.current = newMarkers;
    clustererRef.current.addMarkers(newMarkers);
  }, [artisans, map, onSelectArtisan]);

  return (
    <div className="relative h-full min-h-[360px] w-full">
      <GoogleMap center={{ lat, lng }} zoom={13} onLoad={setMap} className="min-h-[360px]" />
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
  if (lat == null || lng == null) {
    return (
      <div
        className={`flex min-h-[360px] items-center justify-center rounded-xl bg-muted ${className ?? ""}`}
      >
        <p className="text-sm text-muted-foreground">Activez la géolocalisation pour voir les artisans</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <MapStatus>
        <ArtisansMapInner
          lat={lat}
          lng={lng}
          categoryId={categoryId}
          onSelectArtisan={onSelectArtisan}
        />
      </MapStatus>
    </div>
  );
}
