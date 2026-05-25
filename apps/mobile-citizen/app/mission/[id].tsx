import { useLocalSearchParams } from "expo-router";
import { useMemo, type ReactElement } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

import { MissionHeader } from "@/src/components/mission/MissionHeader";
import { OffersBottomSheet } from "@/src/components/mission/OffersBottomSheet";
import { SearchingBanner } from "@/src/components/mission/SearchingBanner";
import { useJobOffersSocket } from "@/src/hooks/useJobOffersSocket";
import { useMissionDetail } from "@/src/hooks/useMissionDetail";

export default function MissionDetailScreen(): ReactElement {
  const { id, searching } = useLocalSearchParams<{ id: string; searching?: string }>();
  const isSearching = searching === "1" || searching === "true";

  const { data: job, isLoading, isError } = useMissionDetail(id ?? "");
  useJobOffersSocket(id);

  const showSearching = useMemo(() => {
    if (!job || !isSearching) return false;
    const pending = (job.offers ?? []).filter((o) => o.status === "PENDING");
    return job.status === "PENDING" && pending.length === 0;
  }, [job, isSearching]);

  const showOffers = job?.status === "PENDING" || job?.status === "ACTIVE";

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#16a34a" />
      </View>
    );
  }

  if (isError || !job) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Mission introuvable</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.flex}>
      <View style={styles.flex}>
        {showSearching && <SearchingBanner />}
        <MissionHeader job={job} />
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          region={{
            latitude: job.lat,
            longitude: job.lng,
            latitudeDelta: 0.03,
            longitudeDelta: 0.03,
          }}
        >
          <Marker coordinate={{ latitude: job.lat, longitude: job.lng }} title="Intervention" />
        </MapView>
        {showOffers && (
          <OffersBottomSheet jobId={job.id} offers={job.offers ?? []} />
        )}
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: "#f8fafc" },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  map: { flex: 1 },
  error: { color: "#dc2626", fontSize: 16 },
});
