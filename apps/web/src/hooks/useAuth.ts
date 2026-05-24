"use client";

import { useSession } from "next-auth/react";

import type { AuthUser, UserRole } from "@/types";

export function useAuth() {
  const { data: session, status, update } = useSession();

  const user: AuthUser | null = session?.user?.profile ?? null;
  const role: UserRole | null = session?.user?.role ?? user?.role ?? null;
  const accessToken = session?.accessToken ?? null;
  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated" && !!user;

  return {
    user,
    role,
    accessToken,
    session,
    status,
    isLoading,
    isAuthenticated,
    update,
  };
}
