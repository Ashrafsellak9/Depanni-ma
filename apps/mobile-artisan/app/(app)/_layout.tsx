import { Stack } from "expo-router";

import { MissionAlertHost } from "@/src/components/mission/MissionAlertModal";

/** Zone authentifiée : onglets, missions, offres */
export default function AppLayout() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="mission/[id]"
          options={{ headerShown: true, title: "Mission" }}
        />
        <Stack.Screen
          name="offer/[jobId]"
          options={{ headerShown: true, title: "Soumettre une offre" }}
        />
        <Stack.Screen
          name="mission/[id]/chat"
          options={{ headerShown: true, title: "Chat" }}
        />
        <Stack.Screen
          name="mission/[id]/recap"
          options={{ headerShown: true, title: "Récapitulatif" }}
        />
      </Stack>
      <MissionAlertHost />
    </>
  );
}
