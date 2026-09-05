"use client";

// TODO: Vérifier et ajuster précisément les coordonnées de chaque quartier
// avant mise en production. Les valeurs actuelles sont approximatives.
// Contrôler chaque point sur OpenStreetMap / Google Maps (centre réel du quartier).
// TODO: Remplacer artisans / temps moyen / interventions par les chiffres réels
// de la plateforme avant production — les stats ci-dessous sont des placeholders.

import { CircleMarker, MapContainer, Popup, TileLayer, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import { getCartoVoyagerTileUrl } from "@/lib/mapsConfig";
import { cn } from "@/lib/utils";

const EL_JADIDA_CENTER: [number, number] = [33.2316, -8.5007];

type Neighborhood = {
  name: string;
  coords: [number, number];
  stats: {
    artisans: number;
    avgResponseMin: number;
    interventionsPerMonth: number;
  };
};

const NEIGHBORHOODS: Neighborhood[] = [
  { name: "Centre-ville", coords: [33.2316, -8.5007], stats: { artisans: 42, avgResponseMin: 12, interventionsPerMonth: 180 } },
  { name: "Hay Salam", coords: [33.24, -8.49], stats: { artisans: 28, avgResponseMin: 18, interventionsPerMonth: 145 } },
  { name: "Hay El Matar", coords: [33.245, -8.515], stats: { artisans: 19, avgResponseMin: 22, interventionsPerMonth: 95 } },
  { name: "Sidi Bouzid", coords: [33.22, -8.53], stats: { artisans: 15, avgResponseMin: 25, interventionsPerMonth: 78 } },
  { name: "Plateau", coords: [33.238, -8.505], stats: { artisans: 24, avgResponseMin: 15, interventionsPerMonth: 130 } },
  { name: "El Jadida Beach", coords: [33.228, -8.51], stats: { artisans: 21, avgResponseMin: 14, interventionsPerMonth: 110 } },
  { name: "Sidi Moussa", coords: [33.21, -8.48], stats: { artisans: 12, avgResponseMin: 28, interventionsPerMonth: 55 } },
  { name: "Boulevard Mohammed V", coords: [33.234, -8.495], stats: { artisans: 31, avgResponseMin: 13, interventionsPerMonth: 165 } },
  { name: "Hay Essalam", coords: [33.226, -8.485], stats: { artisans: 18, avgResponseMin: 20, interventionsPerMonth: 88 } },
  { name: "Route de Casablanca", coords: [33.25, -8.5], stats: { artisans: 14, avgResponseMin: 24, interventionsPerMonth: 62 } },
];

export function CoverageMap({ className }: { className?: string }) {
  return (
    <div className={cn("relative h-[500px] overflow-hidden rounded-3xl border border-line shadow-card lg:h-[600px]", className)}>
      {process.env.NODE_ENV === "development" ? (
        <div className="absolute left-4 right-4 top-4 z-[1100] rounded border border-yellow-500/30 bg-yellow-500/10 p-3 text-xs text-yellow-800">
          Attention : coordonnées GPS approximatives et statistiques de quartiers fictives. À
          vérifier avant production.
        </div>
      ) : null}

      <MapContainer
        center={EL_JADIDA_CENTER}
        zoom={13.5}
        scrollWheelZoom={false}
        className="h-full w-full"
        style={{ background: "#F5EFE6" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url={getCartoVoyagerTileUrl()}
        />
        {NEIGHBORHOODS.map((n) => {
          const size = Math.max(16, Math.min(40, n.stats.interventionsPerMonth / 5));
          return (
            <CircleMarker
              key={n.name}
              center={n.coords}
              radius={size}
              pathOptions={{
                color: "#D9451F",
                fillColor: "#D9451F",
                fillOpacity: 0.4,
                weight: 2.5,
                className: "cursor-pointer",
              }}
            >
              <Tooltip
                permanent
                direction="top"
                offset={[0, -8]}
                className="!rounded-lg !border-line !bg-white !px-2 !py-1 !text-xs !font-medium !text-ink !shadow-sm"
              >
                {n.name}
              </Tooltip>
              <Popup className="depanni-popup">
                <div className="min-w-[200px] p-2 font-sans">
                  <div className="mb-2 font-display text-base font-semibold text-ink">{n.name}</div>
                  <div className="space-y-1 text-sm text-ink/70">
                    <div className="flex justify-between gap-6">
                      <span>Artisans actifs</span>
                      <span className="font-mono font-medium text-ink">{n.stats.artisans}</span>
                    </div>
                    <div className="flex justify-between gap-6">
                      <span>Temps moyen</span>
                      <span className="font-mono font-medium text-ink">{n.stats.avgResponseMin} min</span>
                    </div>
                    <div className="flex justify-between gap-6">
                      <span>Interventions/mois</span>
                      <span className="font-mono font-medium text-ink">{n.stats.interventionsPerMonth}</span>
                    </div>
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>

      <div className="pointer-events-none absolute bottom-4 left-4 z-[1000] rounded-xl border border-line bg-paper/95 px-4 py-3 shadow-sm backdrop-blur-sm">
        <div className="mb-2 text-[10px] uppercase tracking-widest text-ink/50">Taille des cercles</div>
        <div className="flex items-center gap-3 text-xs text-ink/70">
          <div className="flex items-center gap-1.5">
            <div className="size-2 rounded-full bg-rust/60" />
            <span>Faible</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="size-3 rounded-full bg-rust/60" />
            <span>Moyen</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="size-4 rounded-full bg-rust/60" />
            <span>Élevé</span>
          </div>
        </div>
      </div>
    </div>
  );
}
