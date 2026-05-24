"use client";

import { Menu } from "lucide-react";
import { signOut } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { Sidebar, type NavItem } from "@/components/layout/Sidebar";
import { useAuth } from "@/hooks/useAuth";
import { useUiStore } from "@/store/uiStore";

interface DashboardShellProps {
  title: string;
  navItems: NavItem[];
  children: React.ReactNode;
}

export function DashboardShell({ title, navItems, children }: DashboardShellProps) {
  const { user } = useAuth();
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);

  return (
    <div className="flex min-h-screen bg-muted">
      <Sidebar items={navItems} title={title} />
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b bg-background px-4">
          <Button variant="ghost" size="icon" onClick={toggleSidebar} aria-label="Menu">
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-4">
            {user && (
              <span className="text-sm text-muted-foreground">
                {user.firstName} {user.lastName}
              </span>
            )}
            <Button variant="outline" size="sm" onClick={() => signOut({ callbackUrl: "/" })}>
              Déconnexion
            </Button>
          </div>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
