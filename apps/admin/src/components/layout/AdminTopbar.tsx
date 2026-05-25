"use client";

import { Bell, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

import { useAuthStore } from "@/store/authStore";

export function AdminTopbar({ title }: { title: string }) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <header className="flex h-14 items-center justify-between border-b border-slate-200 bg-white px-6">
      <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
      <div className="flex items-center gap-4">
        <button type="button" className="text-slate-500 hover:text-slate-800" aria-label="Notifications">
          <Bell className="h-5 w-5" />
        </button>
        <span className="text-sm text-slate-600">{user?.email ?? "Admin"}</span>
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
        >
          <LogOut className="h-4 w-4" />
          Déconnexion
        </button>
      </div>
    </header>
  );
}
