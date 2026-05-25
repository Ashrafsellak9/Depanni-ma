"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";

import { Sidebar } from "@/components/admin/Sidebar";
import { Topbar } from "@/components/admin/Topbar";
import { AdminNavBadgesProvider } from "@/context/AdminNavBadges";
import { AdminGuard } from "@/components/layout/AdminGuard";

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AdminGuard>
      <AdminNavBadgesProvider>
      <div className="flex min-h-screen bg-page">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <Topbar pathname={pathname} onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1 overflow-y-auto p-6 md:p-7">{children}</main>
        </div>
      </div>
      </AdminNavBadgesProvider>
    </AdminGuard>
  );
}
