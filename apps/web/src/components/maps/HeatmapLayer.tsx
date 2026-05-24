"use client";

import { useEffect, useRef } from "react";

export interface HeatmapPoint {
  lat: number;
  lng: number;
  weight?: number;
}

interface HeatmapLayerProps {
  map: google.maps.Map | null;
  points: HeatmapPoint[];
  /** Rayon en pixels */
  radius?: number;
  opacity?: number;
}

export function HeatmapLayer({
  map,
  points,
  radius = 25,
  opacity = 0.6,
}: HeatmapLayerProps) {
  const layerRef = useRef<google.maps.visualization.HeatmapLayer | null>(null);

  useEffect(() => {
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
        radius,
        opacity,
        gradient: [
          "rgba(0, 255, 255, 0)",
          "rgba(0, 255, 255, 1)",
          "rgba(0, 191, 255, 1)",
          "rgba(0, 127, 255, 1)",
          "rgba(0, 63, 255, 1)",
          "rgba(0, 0, 255, 1)",
          "rgba(0, 0, 223, 1)",
          "rgba(0, 0, 191, 1)",
          "rgba(0, 0, 159, 1)",
          "rgba(0, 0, 127, 1)",
          "rgba(63, 0, 91, 1)",
          "rgba(127, 0, 63, 1)",
          "rgba(191, 0, 31, 1)",
          "rgba(255, 0, 0, 1)",
        ],
      });
    } else {
      layerRef.current.setData(data);
      layerRef.current.setMap(map);
    }

    return () => {
      layerRef.current?.setMap(null);
    };
  }, [map, points, radius, opacity]);

  return null;
}
