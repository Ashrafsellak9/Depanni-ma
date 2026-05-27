export interface CircleHeatmapPoint {
  lat: number;
  lng: number;
  weight?: number;
}

export interface CircleHeatmapOptions {
  baseRadiusMeters?: number;
  fillColor?: string;
  maxOpacity?: number;
}

export function buildCircleHeatmap(
  map: google.maps.Map,
  points: CircleHeatmapPoint[],
  options: CircleHeatmapOptions = {},
): google.maps.Circle[] {
  const baseRadius = options.baseRadiusMeters ?? 600;
  const fillColor = options.fillColor ?? "#F05A1A";
  const maxOpacity = options.maxOpacity ?? 0.32;
  const maxWeight = Math.max(1, ...points.map((p) => p.weight ?? 1));
  const scales = [1, 0.55, 0.3];
  const circles: google.maps.Circle[] = [];

  for (const p of points) {
    const norm = (p.weight ?? 1) / maxWeight;
    for (const scale of scales) {
      circles.push(
        new google.maps.Circle({
          map,
          center: { lat: p.lat, lng: p.lng },
          radius: baseRadius * scale * (0.65 + norm * 0.35),
          fillColor,
          fillOpacity: maxOpacity * scale * (0.55 + norm * 0.45),
          strokeWeight: 0,
          clickable: false,
          zIndex: 1,
        }),
      );
    }
  }

  return circles;
}

export function clearCircleHeatmap(circles: google.maps.Circle[]): void {
  circles.forEach((c) => c.setMap(null));
}
