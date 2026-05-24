"use client";

import { useEffect, useRef } from "react";

import { MapStatus } from "@/components/maps/GoogleMapProvider";

export interface GoogleMapProps {
  center: google.maps.LatLngLiteral;
  zoom?: number;
  className?: string;
  onLoad?: (map: google.maps.Map) => void;
  children?: React.ReactNode;
}

function GoogleMapInner({ center, zoom = 14, className, onLoad, children }: GoogleMapProps) {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    if (!ref.current || mapRef.current) return;

    const map = new google.maps.Map(ref.current, {
      center,
      zoom,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    });
    mapRef.current = map;
    onLoad?.(map);
  }, [center, zoom, onLoad]);

  useEffect(() => {
    mapRef.current?.setCenter(center);
  }, [center]);

  return (
    <div className={className}>
      <div ref={ref} className="h-full w-full min-h-[200px] rounded-xl" />
      {children}
    </div>
  );
}

export function GoogleMap(props: GoogleMapProps) {
  return (
    <MapStatus>
      <GoogleMapInner {...props} />
    </MapStatus>
  );
}
