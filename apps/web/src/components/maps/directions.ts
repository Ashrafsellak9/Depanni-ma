export interface DirectionsEta {
  durationMinutes: number;
  distanceKm: number;
}

export async function fetchDirectionsRoute(
  map: google.maps.Map,
  origin: google.maps.LatLngLiteral,
  destination: google.maps.LatLngLiteral,
): Promise<{
  eta: DirectionsEta;
  renderer: google.maps.DirectionsRenderer;
} | null> {
  if (!window.google?.maps?.DirectionsService) return null;

  const service = new google.maps.DirectionsService();
  const renderer = new google.maps.DirectionsRenderer({
    map,
    suppressMarkers: true,
    polylineOptions: {
      strokeColor: "#2196F3",
      strokeWeight: 5,
      strokeOpacity: 0.85,
    },
  });

  try {
    const result = await service.route({
      origin,
      destination,
      travelMode: google.maps.TravelMode.DRIVING,
    });

    renderer.setDirections(result);
    const leg = result.routes[0]?.legs[0];
    if (!leg?.duration?.value || !leg.distance?.value) return null;

    return {
      eta: {
        durationMinutes: Math.ceil(leg.duration.value / 60),
        distanceKm: Math.round((leg.distance.value / 1000) * 10) / 10,
      },
      renderer,
    };
  } catch {
    renderer.setMap(null);
    return null;
  }
}
