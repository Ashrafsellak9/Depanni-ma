"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { getAccessToken } from "@/lib/token";
import { useAuthStore } from "@/store/authStore";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
    const token = getAccessToken();
    if (!token || user?.role !== "ADMIN") {
      router.replace("/login");
    }
  }, [router, user?.role]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-500">
        Vérification des accès…
      </div>
    );
  }

  if (!getAccessToken() || user?.role !== "ADMIN") {
    return null;
  }

  return <>{children}</>;
}
