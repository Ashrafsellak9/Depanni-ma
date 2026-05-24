import { useRouter, useSegments } from "expo-router";
import { useEffect } from "react";

import { useAuthStore } from "@/src/store/authStore";

export function useProtectedRoute() {
  const router = useRouter();
  const segments = useSegments();
  const { isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!isAuthenticated && !inAuthGroup) {
      router.replace("/(auth)/welcome");
      return;
    }

    if (isAuthenticated && inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [isAuthenticated, isLoading, segments, router]);
}
