"use client";

import { useEffect, useRef, useState } from "react";

import { fetchDirectionsRoute, type DirectionsEta } from "@/components/maps/directions";
import { GoogleMap } from "@/components/maps/GoogleMap";
import { MapStatus } from "@/components/maps/GoogleMapProvider";
import {
  createArtisanTrackingIcon,
  createDestinationIcon,
} from "@/components/maps/markers";
import { useArtisanTracking } from "@/hooks/citizen/useArtisanTracking";

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export interface TrackingMapProps {
  missionId?: string;
  jobLat: number;
  jobLng: number;
  enabled?: boolean;
  /** Mode simple sans mission (legacy) */
  artisanPosition?: { lat: number; lng: number; bearing?: number } | null;
  className?: string;
}

function PulsingClientCircle({
  map,
  center,
}: {
  map: google.maps.Map;
  center: google.maps.LatLngLiteral;
}) {
  useEffect(() => {
    const circle = new google.maps.Circle({
      map,
      center,
      radius: 40,
      fillColor: "#1B2B4B",
      fillOpacity: 0.12,
      strokeColor: "#1B2B4B",
      strokeOpacity: 0.35,
      strokeWeight: 2,
    });

    let growing = true;
    let radius = 40;
    const id = window.setInterval(() => {
      radius += growing ? 4 : -4;
      if (radius >= 90) growing = false;
      if (radius <= 40) growing = true;
      circle.setRadius(radius);
      circle.setOptions({
        fillOpacity: 0.08 + (90 - radius) / 500,
      });
    }, 120);

    return () => {
      clearInterval(id);
      circle.setMap(null);
    };
  }, [map, center]);

  return null;
}

function TrackingMapInner({
  missionId,
  jobLat,
  jobLng,
  enabled,
  artisanPositionProp,
}: {
  missionId?: string;
  jobLat: number;
  jobLng: number;
  enabled: boolean;
  artisanPositionProp?: { lat: number; lng: number; bearing?: number } | null;
}) {
  const destination = { lat: jobLat, lng: jobLng };
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const artisanMarkerRef = useRef<google.maps.Marker | null>(null);
  const destMarkerRef = useRef<google.maps.Marker | null>(null);
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);
  const displayPosRef = useRef<{ lat: number; lng: number; bearing: number } | null>(null);
  const targetPosRef = useRef<{ lat: number; lng: number; bearing: number } | null>(null);
  const frameRef = useRef<number>();
  const mapRef = useRef<google.maps.Map | null>(null);
  const [directionsEta, setDirectionsEta] = useState<DirectionsEta | null>(null);

  const tracking = useArtisanTracking(missionId, enabled && !!missionId);
  const socketPosition = tracking.position;

  useEffect(() => {
    if (socketPosition) {
      targetPosRef.current = {
        lat: socketPosition.lat,
        lng: socketPosition.lng,
        bearing: socketPosition.bearing ?? 0,
      };
    } else if (artisanPositionProp) {
      targetPosRef.current = {
        lat: artisanPositionProp.lat,
        lng: artisanPositionProp.lng,
        bearing: artisanPositionProp.bearing ?? 0,
      };
    }
  }, [socketPosition, artisanPositionProp]);

  useEffect(() => {
    if (!enabled) return;

    const animate = () => {
      const target = targetPosRef.current;
      if (target) {
        const prev = displayPosRef.current ?? target;
        const next = {
          lat: lerp(prev.lat, target.lat, 0.12),
          lng: lerp(prev.lng, target.lng, 0.12),
          bearing: lerp(prev.bearing, target.bearing, 0.15),
        };
        displayPosRef.current = next;
        if (artisanMarkerRef.current) {
          artisanMarkerRef.current.setPosition(next);
          artisanMarkerRef.current.setIcon(createArtisanTrackingIcon(next.bearing));
        }
        mapRef.current?.panTo(next);
      }
      frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [enabled]);

  useEffect(() => {
    if (!map || !enabled) return;

    destMarkerRef.current = new google.maps.Marker({
      map,
      position: destination,
      title: "Votre adresse",
      icon: createDestinationIcon(),
      zIndex: 1,
    });

    const pos = displayPosRef.current ?? targetPosRef.current;
    const start = pos ?? { lat: destination.lat, lng: destination.lng, bearing: 0 };
    if (!displayPosRef.current) displayPosRef.current = start;

    artisanMarkerRef.current = new google.maps.Marker({
      map,
      position: { lat: start.lat, lng: start.lng },
      title: "Artisan",
      icon: createArtisanTrackingIcon(start.bearing),
      zIndex: 2,
    });

    map.setCenter({ lat: start.lat, lng: start.lng });
    mapRef.current = map;

    return () => {
      destMarkerRef.current?.setMap(null);
      artisanMarkerRef.current?.setMap(null);
    };
  }, [map, enabled, destination, jobLat, jobLng]);

  const updateRoute = async () => {
    if (!map || !enabled) return;
    const origin = displayPosRef.current ?? targetPosRef.current;
    if (!origin) return;

    if (directionsRendererRef.current) {
      directionsRendererRef.current.setMap(null);
    }

    const result = await fetchDirectionsRoute(map, origin, destination);
    if (result) {
      directionsRendererRef.current = result.renderer;
      setDirectionsEta(result.eta);
    }
  };

  useEffect(() => {
    if (!map || !enabled) return;
    void updateRoute();
    const id = window.setInterval(() => void updateRoute(), 30_000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, enabled, jobLat, jobLng]);

  useEffect(() => {
    if (!map || !displayPosRef.current) return;
    const t = window.setTimeout(() => void updateRoute(), 800);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socketPosition?.lat, socketPosition?.lng]);

  const eta = directionsEta ?? tracking.eta;
  const arrived = tracking.arrived;

  return (
    <div className="relative">
      <GoogleMap
        center={displayPosRef.current ?? destination}
        zoom={14}
        onLoad={(m) => {
          setMap(m);
          mapRef.current = m;
        }}
        className="min-h-[280px] md:min-h-[320px]"
      />
      {map && enabled && <PulsingClientCircle map={map} center={destination} />}
      {(eta || arrived) && (
        <div className="absolute bottom-3 left-3 rounded-lg bg-card/95 px-3 py-2 text-sm shadow-md z-10">
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

export function TrackingMap({
  missionId,
  jobLat,
  jobLng,
  enabled = true,
  artisanPosition,
  className,
}: TrackingMapProps) {
  const trackingActive = enabled && (!!missionId || !!artisanPosition);

  if (!trackingActive) {
    return (
      <div
        className={`flex h-[280px] items-center justify-center rounded-xl bg-muted text-sm text-muted-foreground ${className ?? ""}`}
      >
        Suivi disponible une fois la mission acceptée
      </div>
    );
  }

  return (
    <div className={className}>
      <MapStatus>
        <TrackingMapInner
          missionId={missionId}
          jobLat={jobLat}
          jobLng={jobLng}
          enabled={trackingActive}
          artisanPositionProp={artisanPosition}
        />
      </MapStatus>
    </div>
  );
}
