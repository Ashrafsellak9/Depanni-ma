"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { ArtisanSidebar } from "@/components/artisan/ArtisanSidebar";
import { ArtisanTopbar } from "@/components/artisan/ArtisanTopbar";
import { useArtisanAuthStore } from "@/store/artisanAuthStore";

const AUTH_ROUTES = ["/artisan/login", "/artisan/register", "/artisan/pending"];

export default function ArtisanLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const hydrate = useArtisanAuthStore((s) => s.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const isAuthPage = AUTH_ROUTES.includes(pathname);

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-[#EDE8DF]">
      <ArtisanSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <ArtisanTopbar pathname={pathname} onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-6 md:p-7">{children}</main>
      </div>
    </div>
  );
}
