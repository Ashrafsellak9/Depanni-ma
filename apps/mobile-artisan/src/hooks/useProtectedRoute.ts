import { useRouter, useSegments } from "expo-router";
import { useEffect } from "react";

import { useAuthStore } from "@/src/store/authStore";

export function useProtectedRoute(): void {
  const router = useRouter();
  const segments = useSegments();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);

  useEffect(() => {
    if (isLoading) return;
    const inAuth = segments[0] === "(auth)";

    if (!isAuthenticated && !inAuth) {
      router.replace("/(auth)/login" as never);
    } else if (isAuthenticated && inAuth) {
      router.replace("/(app)/(tabs)" as never);
    }
  }, [isAuthenticated, isLoading, segments, router]);
}
