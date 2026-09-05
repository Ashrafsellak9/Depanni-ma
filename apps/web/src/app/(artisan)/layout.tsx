import { GoogleMapProvider } from "@/components/maps/GoogleMapProvider";

export default function ArtisanGroupLayout({ children }: { children: React.ReactNode }) {
  return <GoogleMapProvider>{children}</GoogleMapProvider>;
}
