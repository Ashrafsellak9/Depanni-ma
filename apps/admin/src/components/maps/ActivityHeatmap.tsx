"use client";

import { Status, Wrapper } from "@googlemaps/react-wrapper";
import { useEffect, useRef } from "react";

import type { HeatmapPoint } from "@/types/admin";

const EL_JADIDA = { lat: 33.2316, lng: -8.5007 };

function HeatmapMap({ points }: { points: HeatmapPoint[] }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const layerRef = useRef<google.maps.visualization.HeatmapLayer | null>(null);

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
    if (!map || !window.google?.maps?.visualization) return;

    const data = points.map(
      (p) =>
        ({
          location: new google.maps.LatLng(p.lat, p.lng),
          weight: p.weight ?? 1,
        }) as google.maps.visualization.WeightedLocation,
    );

    if (!layerRef.current) {
      layerRef.current = new google.maps.visualization.HeatmapLayer({
        map,
        data,
        radius: 28,
        opacity: 0.65,
      });
    } else {
      layerRef.current.setData(data);
    }
  }, [points]);

  return <div ref={mapRef} className="h-full min-h-[280px] w-full rounded-lg" />;
}

export function ActivityHeatmap({ points }: { points: HeatmapPoint[] }) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

  if (!apiKey) {
    return (
      <div className="flex h-72 items-center justify-center rounded-lg bg-slate-100 text-sm text-slate-500">
        Configurez NEXT_PUBLIC_GOOGLE_MAPS_API_KEY pour la carte
      </div>
    );
  }

  return (
    <Wrapper
      apiKey={apiKey}
      libraries={["visualization"]}
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
