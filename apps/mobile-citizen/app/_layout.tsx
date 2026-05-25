import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";

import { LoadingScreen } from "@/src/components/LoadingScreen";
import { setSessionExpiredHandler } from "@/src/lib/auth-events";
import { useProtectedRoute } from "@/src/hooks/useProtectedRoute";
import { AppProviders } from "@/src/providers/AppProviders";
import { useAuthStore } from "@/src/store/authStore";

function RootNavigator() {
  const router = useRouter();
  const hydrate = useAuthStore((s) => s.hydrate);
  const logout = useAuthStore((s) => s.logout);
  const isLoading = useAuthStore((s) => s.isLoading);

  useProtectedRoute();

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  useEffect(() => {
    setSessionExpiredHandler(() => {
      void logout().then(() => {
        router.replace("/(auth)/login");
      });
    });
    return () => setSessionExpiredHandler(null);
  }, [logout, router]);

  if (isLoading) {
    return <LoadingScreen label="DEPANNI…" />;
  }

  return (
    <>
      <StatusBar style="light" backgroundColor="#15803d" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="request/new"
          options={{ headerShown: true, title: "Nouvelle demande", presentation: "modal" }}
        />
        <Stack.Screen
          name="mission/[id]"
          options={{ headerShown: false, title: "Mission" }}
        />
        <Stack.Screen
          name="mission/[id]/chat"
          options={{ headerShown: true, title: "Chat" }}
        />
        <Stack.Screen
          name="mission/[id]/review"
          options={{ headerShown: true, title: "Notation" }}
        />
        <Stack.Screen
          name="artisan/[id]"
          options={{ headerShown: true, title: "Artisan" }}
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <AppProviders>
      <RootNavigator />
    </AppProviders>
  );
}
