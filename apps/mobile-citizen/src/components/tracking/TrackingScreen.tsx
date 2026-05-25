import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router";
import { useCallback, useMemo, useRef, useState } from "react";
import { Linking, StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import { Avatar, Button, IconButton } from "react-native-paper";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { ArrivedModal } from "@/src/components/tracking/ArrivedModal";
import { useArtisanTracking } from "@/src/hooks/useArtisanTracking";
import { getApiErrorMessage } from "@/src/lib/api";
import { completeMission } from "@/src/services/jobs";
import type { CitizenMission } from "@/src/types/mission";

interface TrackingScreenProps {
  jobId: string;
  jobLat: number;
  jobLng: number;
  mission: CitizenMission;
  offerId: string;
}

export function TrackingScreen({ jobId, jobLat, jobLng, mission, offerId }: TrackingScreenProps) {
  const router = useRouter();
  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["42%"], []);
  const [arrivedModal, setArrivedModal] = useState(false);
  const qc = useQueryClient();

  const artisan = mission.artisan;
  const artisanName = artisan
    ? `${artisan.firstName} ${artisan.lastName}`.trim()
    : "Artisan";
  const phone = artisan?.user?.phone;

  const onArrived = useCallback(() => setArrivedModal(true), []);

  const { displayPos, routeCoords, eta, arrived } = useArtisanTracking(
    mission.id,
    jobLat,
    jobLng,
    true,
    onArrived,
  );

  const completeMut = useMutation({
    mutationFn: () => completeMission(jobId, offerId),
    onSuccess: () => {
      setArrivedModal(false);
      void qc.invalidateQueries({ queryKey: ["mission-detail", jobId] });
      router.replace({
        pathname: "/mission/[id]/review",
        params: { id: jobId, missionId: mission.id },
      } as never);
    },
    onError: (e) => console.warn(getApiErrorMessage(e)),
  });

  const region = useMemo(
    () => ({
      latitude: (displayPos.lat + jobLat) / 2,
      longitude: (displayPos.lng + jobLng) / 2,
      latitudeDelta: 0.04,
      longitudeDelta: 0.04,
    }),
    [displayPos.lat, displayPos.lng, jobLat, jobLng],
  );

  const openChat = () => {
    router.push({
      pathname: "/mission/[id]/chat",
      params: { id: jobId, missionId: mission.id },
    } as never);
  };

  const callArtisan = () => {
    if (phone) void Linking.openURL(`tel:${phone}`);
  };

  return (
    <GestureHandlerRootView style={styles.root}>
      <MapView style={styles.map} provider={PROVIDER_GOOGLE} region={region}>
        <Marker
          coordinate={{ latitude: jobLat, longitude: jobLng }}
          title="Votre adresse"
          pinColor="#1B2B4B"
        />
        <Marker
          coordinate={{ latitude: displayPos.lat, longitude: displayPos.lng }}
          title={artisanName}
          pinColor="#16a34a"
        />
        {routeCoords.length > 1 && (
          <Polyline coordinates={routeCoords} strokeColor="#2563eb" strokeWidth={4} />
        )}
      </MapView>

      <BottomSheet ref={sheetRef} index={0} snapPoints={snapPoints} enablePanDownToClose={false}>
        <BottomSheetView style={styles.sheet}>
          <View style={styles.artisanRow}>
            {artisan?.avatar ? (
              <Avatar.Image size={52} source={{ uri: artisan.avatar }} />
            ) : (
              <Avatar.Text size={52} label={artisanName.slice(0, 2).toUpperCase()} />
            )}
            <View style={styles.artisanInfo}>
              <Text style={styles.artisanName}>{artisanName}</Text>
              {artisan?.rating != null && (
                <Text style={styles.rating}>★ {artisan.rating.toFixed(1)}</Text>
              )}
            </View>
          </View>

          <View style={styles.etaBox}>
            {arrived ? (
              <Text style={styles.etaArrived}>Artisan sur place</Text>
            ) : eta ? (
              <Text style={styles.etaText}>
                Arrivée estimée ~{eta.durationMinutes} min · {eta.distanceKm} km
              </Text>
            ) : (
              <Text style={styles.etaText}>Calcul de l&apos;itinéraire…</Text>
            )}
          </View>

          <View style={styles.actions}>
            <Button mode="contained" icon="chat" onPress={openChat} style={styles.actionBtn}>
              Chat
            </Button>
            <Button
              mode="outlined"
              icon="phone"
              onPress={callArtisan}
              disabled={!phone}
              style={styles.actionBtn}
            >
              Appel
            </Button>
          </View>

          {arrived && (
            <Button
              mode="contained-tonal"
              onPress={() => setArrivedModal(true)}
              style={styles.validateHint}
            >
              Valider l&apos;intervention
            </Button>
          )}
        </BottomSheetView>
      </BottomSheet>

      <IconButton
        icon="arrow-left"
        size={24}
        style={styles.back}
        onPress={() => router.back()}
      />

      <ArrivedModal
        visible={arrivedModal}
        loading={completeMut.isPending}
        onValidate={() => completeMut.mutate()}
        onDismiss={() => setArrivedModal(false)}
      />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  map: { ...StyleSheet.absoluteFillObject },
  back: {
    position: "absolute",
    top: 48,
    left: 8,
    backgroundColor: "#fff",
  },
  sheet: { paddingHorizontal: 20, paddingBottom: 24 },
  artisanRow: { flexDirection: "row", alignItems: "center", gap: 14 },
  artisanInfo: { flex: 1 },
  artisanName: { fontSize: 18, fontWeight: "700", color: "#14532d" },
  rating: { marginTop: 4, color: "#ca8a04", fontWeight: "600" },
  etaBox: {
    marginTop: 16,
    backgroundColor: "#f0fdf4",
    borderRadius: 12,
    padding: 14,
  },
  etaText: { fontSize: 15, color: "#166534", fontWeight: "600" },
  etaArrived: { fontSize: 16, color: "#15803d", fontWeight: "800" },
  actions: { flexDirection: "row", gap: 10, marginTop: 16 },
  actionBtn: { flex: 1 },
  validateHint: { marginTop: 12 },
});
