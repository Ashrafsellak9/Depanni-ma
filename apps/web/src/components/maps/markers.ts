/** Couleurs & icônes SVG par métier (markers custom, pas les pins Google par défaut) */

const CATEGORY_COLORS: Record<string, string> = {
  plomberie: "#2196F3",
  electricite: "#FFC107",
  climatisation: "#00BCD4",
  serrurerie: "#9C27B0",
  peinture: "#4CAF50",
  mecanique: "#E8622A",
};

function svgPin(color: string, inner: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="48" viewBox="0 0 40 48">
    <path fill="${color}" stroke="#fff" stroke-width="2" d="M20 0C9 0 0 9 0 20c0 14 20 28 20 28s20-14 20-28C40 9 31 0 20 0z"/>
    <circle cx="20" cy="20" r="11" fill="#fff"/>
    ${inner}
  </svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

const CATEGORY_INNER: Record<string, string> = {
  plomberie: `<path fill="${CATEGORY_COLORS.plomberie}" d="M14 24h12v2H14zm2-8h8l-2 6h-4z"/>`,
  electricite: `<path fill="${CATEGORY_COLORS.electricite}" d="M22 12l-6 12h4l-2 8 8-14h-4z"/>`,
  climatisation: `<path fill="${CATEGORY_COLORS.climatisation}" d="M12 18h16v4H12zm4 6h8v2h-8z"/>`,
  serrurerie: `<path fill="${CATEGORY_COLORS.serrurerie}" d="M14 22h12v6H14zm6-10a4 4 0 100 8 4 4 0 000-8z"/>`,
  peinture: `<path fill="${CATEGORY_COLORS.peinture}" d="M12 26h16l-2 6H14zm4-12h8v10h-8z"/>`,
  mecanique: `<path fill="${CATEGORY_COLORS.mecanique}" d="M14 20h12l-2 8H16zm4-10 3 3-3 3 3-3-3 3z"/>`,
};

export function getCategorySlug(artisan: {
  specialties?: string[];
}): string | undefined {
  return artisan.specialties?.[0];
}

export function createArtisanCategoryIcon(
  categorySlug?: string,
  verified = false,
): google.maps.Icon | google.maps.Symbol {
  const slug = categorySlug ?? "mecanique";
  const color = verified ? "#2E7D32" : (CATEGORY_COLORS[slug] ?? "#E8622A");
  const inner = CATEGORY_INNER[slug] ?? CATEGORY_INNER.mecanique ?? "";
  return {
    url: svgPin(color, inner),
    scaledSize: new google.maps.Size(36, 44),
    anchor: new google.maps.Point(18, 44),
  };
}

export function createArtisanTrackingIcon(bearing = 0): google.maps.Symbol {
  return {
    path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
    scale: 6,
    fillColor: "#E8622A",
    fillOpacity: 1,
    strokeColor: "#FFFFFF",
    strokeWeight: 2,
    rotation: bearing,
  };
}

export function createDestinationIcon(): google.maps.Symbol {
  return {
    path: google.maps.SymbolPath.CIRCLE,
    scale: 11,
    fillColor: "#1B2B4B",
    fillOpacity: 1,
    strokeColor: "#FFFFFF",
    strokeWeight: 3,
  };
}

export function buildArtisanInfoHtml(artisan: {
  firstName: string;
  lastName: string;
  avatarUrl?: string | null;
  rating: number;
  distanceKm: number;
  hourlyRate?: number | null;
  etaMinutes?: number | null;
}): string {
  const photo = artisan.avatarUrl
    ? `<img src="${artisan.avatarUrl}" alt="" style="width:40px;height:40px;border-radius:50%;object-fit:cover" />`
    : `<div style="width:40px;height:40px;border-radius:50%;background:#E8622A;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:bold">${artisan.firstName[0]}</div>`;

  return `
    <div style="font-family:system-ui,sans-serif;min-width:180px;padding:4px">
      <div style="display:flex;gap:10px;align-items:center">
        ${photo}
        <div>
          <strong style="color:#1B2B4B">${artisan.firstName} ${artisan.lastName}</strong>
          <div style="font-size:13px;color:#666">★ ${artisan.rating.toFixed(1)} · ${artisan.distanceKm} km</div>
        </div>
      </div>
      ${artisan.hourlyRate ? `<div style="margin-top:8px;font-size:13px;color:#E8622A;font-weight:600">${artisan.hourlyRate} MAD/h</div>` : ""}
      ${artisan.etaMinutes != null ? `<div style="margin-top:4px;font-size:12px;color:#2E7D32">ETA ~${artisan.etaMinutes} min</div>` : ""}
    </div>`;
}
