import { useLocalSearchParams, useRouter } from "expo-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { ActivityIndicator, Button } from "react-native-paper";

import { getApiErrorMessage } from "@/src/lib/api";
import { openNavigationChooser } from "@/src/lib/navigation-apps";
import { fetchMission } from "@/src/services/artisan";
import { completeMissionOffer } from "@/src/services/jobs";
import { confirmArrived, startMissionTracking } from "@/src/services/tracking";

export default function ArtisanMissionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const qc = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const [arrived, setArrived] = useState(false);
  const [trackingStarted, setTrackingStarted] = useState(false);

  const { data: mission, isLoading, isError, refetch } = useQuery({
    queryKey: ["artisan-mission", id],
    queryFn: () => fetchMission(id ?? ""),
    enabled: Boolean(id),
    refetchInterval: 15_000,
  });

  const startNavMut = useMutation({
    mutationFn: () => startMissionTracking(mission!.id),
    onSuccess: () => {
      setTrackingStarted(true);
      void openNavigationChooser({
        lat: mission!.job.lat,
        lng: mission!.job.lng,
        label: mission!.job.address,
      });
    },
    onError: (e) => setError(getApiErrorMessage(e)),
  });

  const arrivedMut = useMutation({
    mutationFn: () => confirmArrived(mission!.id),
    onSuccess: () => setArrived(true),
    onError: (e) => setError(getApiErrorMessage(e)),
  });

  const completeMut = useMutation({
    mutationFn: () => completeMissionOffer(mission!.jobId, mission!.offer.id),
    onSuccess: (result) => {
      void qc.invalidateQueries({ queryKey: ["artisan-missions"] });
      void qc.invalidateQueries({ queryKey: ["artisan-earnings"] });
      const net = result.mission?.artisanNet ?? mission?.offer.price ?? 0;
      router.replace({
        pathname: "/(app)/mission/[id]/recap",
        params: {
          id: mission!.id,
          netAmount: String(net),
          jobTitle: mission!.job.title,
        },
      } as never);
    },
    onError: (e) => setError(getApiErrorMessage(e)),
  });

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#15803d" />
      </View>
    );
  }

  if (isError || !mission) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Mission introuvable</Text>
      </View>
    );
  }

  const isActive = ["ACCEPTED", "IN_PROGRESS"].includes(mission.status);
  const isDone = mission.status === "COMPLETED";

  return (
    <View style={styles.flex}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        region={{
          latitude: mission.job.lat,
          longitude: mission.job.lng,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
      >
        <Marker
          coordinate={{ latitude: mission.job.lat, longitude: mission.job.lng }}
          title={mission.job.address}
        />
      </MapView>

      <View style={styles.panel}>
        <Text style={styles.title}>{mission.job.title}</Text>
        <Text style={styles.meta}>
          {mission.job.address}, {mission.job.city}
        </Text>
        <Text style={styles.meta}>
          Client : {mission.citizen.firstName} {mission.citizen.lastName}
        </Text>
        <Text style={styles.price}>
          {mission.artisanNet ?? mission.offer.price} MAD net
        </Text>

        {error && <Text style={styles.error}>{error}</Text>}

        {isActive && !isDone && (
          <>
            <Button
              mode="contained"
              icon="navigation"
              loading={startNavMut.isPending}
              onPress={() => startNavMut.mutate()}
              style={styles.btn}
            >
              Démarrer la navigation
            </Button>
            {trackingStarted && (
              <Text style={styles.hint}>Suivi GPS activé pour le client</Text>
            )}

            <Button
              mode="contained-tonal"
              icon="map-marker-check"
              loading={arrivedMut.isPending}
              disabled={arrived}
              onPress={() => arrivedMut.mutate()}
              style={styles.btn}
            >
              {arrived ? "Arrivée confirmée" : "Je suis arrivé"}
            </Button>

            <Button
              mode="outlined"
              icon="check-circle"
              loading={completeMut.isPending}
              disabled={!arrived}
              onPress={() => completeMut.mutate()}
              style={styles.btn}
            >
              Mission terminée
            </Button>
          </>
        )}

        {isDone && (
          <Button mode="contained" onPress={() => void refetch()}>
            Mission clôturée
          </Button>
        )}

        <Button
          mode="text"
          onPress={() =>
            router.push({
              pathname: "/(app)/mission/[id]/chat",
              params: { id: mission.id, missionId: mission.id },
            } as never)
          }
        >
          Chat client
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  map: { height: 260 },
  panel: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 20, fontWeight: "800", color: "#14532d" },
  meta: { marginTop: 6, color: "#64748b", fontSize: 14 },
  price: { marginTop: 12, fontSize: 22, fontWeight: "800", color: "#15803d" },
  btn: { marginTop: 12 },
  hint: { marginTop: 6, fontSize: 12, color: "#64748b" },
  error: { color: "#dc2626", marginTop: 8 },
});
