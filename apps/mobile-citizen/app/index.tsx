import { Redirect } from "expo-router";

import { LoadingScreen } from "@/src/components/LoadingScreen";
import { useAuthStore } from "@/src/store/authStore";

export default function Index() {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/(auth)/welcome" />;
}
