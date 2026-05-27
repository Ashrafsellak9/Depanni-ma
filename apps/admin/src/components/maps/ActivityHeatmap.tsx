"use client";

import { Status, Wrapper } from "@googlemaps/react-wrapper";
import { useEffect, useRef } from "react";

import { buildCircleHeatmap, clearCircleHeatmap } from "@/lib/circleHeatmap";
import { getGoogleMapsApiKey } from "@/lib/mapsConfig";
import type { HeatmapPoint } from "@/types/admin";

const EL_JADIDA = { lat: 33.2316, lng: -8.5007 };

function HeatmapMap({ points }: { points: HeatmapPoint[] }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const circlesRef = useRef<google.maps.Circle[]>([]);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;
    mapInstance.current = new google.maps.Map(mapRef.current, {
      center: EL_JADIDA,
      zoom: 12,
      mapTypeId: "roadmap",
    });
  }, []);

  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;

    clearCircleHeatmap(circlesRef.current);
    circlesRef.current = buildCircleHeatmap(map, points, {
      fillColor: "#F05A1A",
      baseRadiusMeters: 700,
      maxOpacity: 0.28,
    });

    return () => clearCircleHeatmap(circlesRef.current);
  }, [points]);

  return <div ref={mapRef} className="h-full min-h-[280px] w-full rounded-lg" />;
}

export function ActivityHeatmap({ points }: { points: HeatmapPoint[] }) {
  const apiKey = getGoogleMapsApiKey();

  if (!apiKey) {
    return (
      <div className="flex h-72 items-center justify-center rounded-lg bg-slate-100 text-sm text-slate-500">
        Configurez GOOGLE_MAPS_API_KEY ou NEXT_PUBLIC_GOOGLE_MAPS_API_KEY dans le .env racine
      </div>
    );
  }

  return (
    <Wrapper
      apiKey={apiKey}
      render={(status) => {
        if (status === Status.LOADING) {
          return <div className="flex h-72 items-center justify-center text-slate-400">Chargement…</div>;
        }
        if (status === Status.FAILURE) {
          return <div className="flex h-72 items-center justify-center text-red-500">Erreur carte</div>;
        }
        return <HeatmapMap points={points} />;
      }}
    />
  );
}
