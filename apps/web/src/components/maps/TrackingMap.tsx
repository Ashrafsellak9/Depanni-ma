"use client";

import { useEffect, useState } from "react";

import { ArtisanMarker } from "@/components/maps/ArtisanMarker";
import { GoogleMap } from "@/components/maps/GoogleMap";

interface TrackingMapProps {
  destination: { lat: number; lng: number };
  artisanPosition?: { lat: number; lng: number } | null;
  className?: string;
}

function DestinationMarker({
  map,
  position,
}: {
  map: google.maps.Map;
  position: { lat: number; lng: number };
}) {
  useEffect(() => {
    const marker = new google.maps.Marker({
      map,
      position,
      title: "Destination",
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor: "#1E3A5F",
        fillOpacity: 1,
        strokeColor: "#FFFFFF",
        strokeWeight: 2,
      },
    });
    return () => marker.setMap(null);
  }, [map, position]);

  return null;
}

export function TrackingMap({ destination, artisanPosition, className }: TrackingMapProps) {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const center = artisanPosition ?? destination;

  return (
    <div className={className}>
      <GoogleMap center={center} zoom={14} onLoad={setMap} className="min-h-[320px]" />
      {map && (
        <>
          <DestinationMarker map={map} position={destination} />
          {artisanPosition && (
            <ArtisanMarker map={map} position={artisanPosition} label="Artisan" />
          )}
        </>
      )}
    </div>
  );
}
