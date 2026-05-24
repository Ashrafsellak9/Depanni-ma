"use client";

import { Status, Wrapper } from "@googlemaps/react-wrapper";
import { useEffect, useRef } from "react";

interface GoogleMapProps {
  center: google.maps.LatLngLiteral;
  zoom?: number;
  className?: string;
  onLoad?: (map: google.maps.Map) => void;
  children?: React.ReactNode;
}

function MapInner({ center, zoom = 14, className, onLoad, children }: GoogleMapProps) {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    if (!ref.current || mapRef.current) return;

    const map = new google.maps.Map(ref.current, {
      center,
      zoom,
      disableDefaultUI: false,
      mapTypeControl: false,
      streetViewControl: false,
    });
    mapRef.current = map;
    onLoad?.(map);
  }, [center, zoom, onLoad]);

  useEffect(() => {
    mapRef.current?.setCenter(center);
  }, [center]);

  return (
    <div className={className}>
      <div ref={ref} className="h-full w-full min-h-[280px] rounded-lg" />
      {children}
    </div>
  );
}

function MapLoading() {
  return (
    <div className="flex min-h-[280px] items-center justify-center rounded-lg bg-muted text-sm text-muted-foreground">
      Chargement de la carte…
    </div>
  );
}

function MapError() {
  return (
    <div className="flex min-h-[280px] items-center justify-center rounded-lg border border-dashed text-sm text-danger">
      Carte indisponible — vérifiez NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    </div>
  );
}

export function GoogleMap(props: GoogleMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

  return (
    <Wrapper apiKey={apiKey} render={(status) => {
      if (status === Status.LOADING) return <MapLoading />;
      if (status === Status.FAILURE) return <MapError />;
      return <MapInner {...props} />;
    }} />
  );
}
