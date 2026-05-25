import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { Linking, StyleSheet, Text, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { ActivityIndicator, Button } from "react-native-paper";

import { fetchMission } from "@/src/services/artisan";

export default function ArtisanMissionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const { data: mission, isLoading, isError } = useQuery({
    queryKey: ["artisan-mission", id],
    queryFn: () => fetchMission(id ?? ""),
    enabled: Boolean(id),
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

  const openGps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${mission.job.lat},${mission.job.lng}`;
    void Linking.openURL(url);
  };

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
        <Text style={styles.price}>{mission.offer.price} MAD</Text>

        <Button mode="contained" icon="navigation" onPress={openGps} style={styles.btn}>
          Navigation GPS
        </Button>
        <Button
          mode="outlined"
          icon="chat"
          onPress={() =>
            router.push({
              pathname: "/mission/[id]/chat",
              params: { id: mission.id, missionId: mission.id },
            } as never)
          }
          style={styles.btn}
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
  map: { height: 280 },
  panel: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 20, fontWeight: "800", color: "#14532d" },
  meta: { marginTop: 6, color: "#64748b", fontSize: 14 },
  price: { marginTop: 12, fontSize: 22, fontWeight: "800", color: "#15803d" },
  btn: { marginTop: 12 },
  error: { color: "#dc2626" },
});
