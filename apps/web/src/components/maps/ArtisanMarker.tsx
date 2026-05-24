"use client";

import { useEffect } from "react";

interface ArtisanMarkerProps {
  map: google.maps.Map | null;
  position: google.maps.LatLngLiteral;
  label?: string;
}

export function ArtisanMarker({ map, position, label }: ArtisanMarkerProps) {
  useEffect(() => {
    if (!map) return;

    const marker = new google.maps.Marker({
      map,
      position,
      title: label ?? "Artisan",
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: "#E8622A",
        fillOpacity: 1,
        strokeColor: "#FFFFFF",
        strokeWeight: 2,
      },
    });

    return () => {
      marker.setMap(null);
    };
  }, [map, position, label]);

  return null;
}
