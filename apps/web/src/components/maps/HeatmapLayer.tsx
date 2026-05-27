"use client";

import { useEffect, useRef } from "react";

import { buildCircleHeatmap, clearCircleHeatmap } from "@/lib/maps/circleHeatmap";

export interface HeatmapPoint {
  lat: number;
  lng: number;
  weight?: number;
}

interface HeatmapLayerProps {
  map: google.maps.Map | null;
  points: HeatmapPoint[];
  /** Rayon de base en mètres */
  radiusMeters?: number;
  opacity?: number;
  fillColor?: string;
}

export function HeatmapLayer({
  map,
  points,
  radiusMeters = 600,
  opacity = 0.32,
  fillColor = "#F05A1A",
}: HeatmapLayerProps) {
  const circlesRef = useRef<google.maps.Circle[]>([]);

  useEffect(() => {
    if (!map) return;

    clearCircleHeatmap(circlesRef.current);
    circlesRef.current = buildCircleHeatmap(map, points, {
      baseRadiusMeters: radiusMeters,
      maxOpacity: opacity,
      fillColor,
    });

    return () => clearCircleHeatmap(circlesRef.current);
  }, [map, points, radiusMeters, opacity, fillColor]);

  return null;
}
