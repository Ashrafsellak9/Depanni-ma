import { ArtisanShell } from "@/components/layout/ArtisanShell";

export default function ArtisanLayout({ children }: { children: React.ReactNode }) {
  return <ArtisanShell>{children}</ArtisanShell>;
}
