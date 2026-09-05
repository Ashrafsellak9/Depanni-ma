import { GoogleMapProvider } from "@/components/maps/GoogleMapProvider";
import { CitizenShell } from "@/components/layout/CitizenShell";

export default function CitizenLayout({ children }: { children: React.ReactNode }) {
  return (
    <GoogleMapProvider>
      <CitizenShell>{children}</CitizenShell>
    </GoogleMapProvider>
  );
}
