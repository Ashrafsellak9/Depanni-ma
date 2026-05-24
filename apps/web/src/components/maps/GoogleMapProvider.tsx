"use client";

import Script from "next/script";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

interface GoogleMapsContextValue {
  isReady: boolean;
  loadError: boolean;
  apiKey: string;
}

const GoogleMapsContext = createContext<GoogleMapsContextValue | null>(null);

const MAPS_CALLBACK = "__depanniGoogleMapsInit";

function buildMapsScriptUrl(apiKey: string, libraries: string[]): string {
  const libs = libraries.join(",");
  return `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=${libs}&loading=async&callback=${MAPS_CALLBACK}`;
}

export function GoogleMapProvider({ children }: { children: ReactNode }) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
  const [isReady, setIsReady] = useState(false);
  const [loadError, setLoadError] = useState(false);

  const onMapsReady = useCallback(() => {
    if (window.google?.maps) {
      setIsReady(true);
      setLoadError(false);
    }
  }, []);

  useEffect(() => {
    (window as unknown as Record<string, () => void>)[MAPS_CALLBACK] = onMapsReady;
    if (window.google?.maps) onMapsReady();
    return () => {
      delete (window as unknown as Record<string, () => void>)[MAPS_CALLBACK];
    };
  }, [onMapsReady]);

  const value = useMemo(
    () => ({ isReady, loadError, apiKey }),
    [isReady, loadError, apiKey],
  );

  if (!apiKey) {
    return (
      <GoogleMapsContext.Provider value={{ isReady: false, loadError: true, apiKey: "" }}>
        {children}
      </GoogleMapsContext.Provider>
    );
  }

  return (
    <GoogleMapsContext.Provider value={value}>
      <Script
        id="depanni-google-maps"
        src={buildMapsScriptUrl(apiKey, ["places", "visualization", "geometry"])}
        strategy="afterInteractive"
        onError={() => setLoadError(true)}
      />
      {children}
    </GoogleMapsContext.Provider>
  );
}

export function useGoogleMaps(): GoogleMapsContextValue {
  const ctx = useContext(GoogleMapsContext);
  if (!ctx) {
    throw new Error("useGoogleMaps must be used within GoogleMapProvider");
  }
  return ctx;
}

export function MapStatus({
  children,
  loading,
  error,
}: {
  children: ReactNode;
  loading?: ReactNode;
  error?: ReactNode;
}) {
  const { isReady, loadError } = useGoogleMaps();

  if (loadError) {
    return (
      error ?? (
        <div className="flex min-h-[200px] items-center justify-center rounded-xl border border-dashed p-4 text-sm text-danger">
          Carte indisponible — vérifiez NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
        </div>
      )
    );
  }

  if (!isReady) {
    return (
      loading ?? (
        <div className="flex min-h-[200px] animate-pulse items-center justify-center rounded-xl bg-muted text-sm text-muted-foreground">
          Chargement de la carte…
        </div>
      )
    );
  }

  return <>{children}</>;
}
