import { useRouter } from "expo-router";
import * as Location from "expo-location";
import { useEffect, useState, type ReactElement } from "react";
import { StyleSheet, Text, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { Button, FAB } from "react-native-paper";

import { ScreenHeader } from "@/src/components/ScreenHeader";

const CASABLANCA = { latitude: 33.5731, longitude: -7.5898, latitudeDelta: 0.08, longitudeDelta: 0.08 };

export default function HomeScreen(): ReactElement {
  const router = useRouter();
  const [region, setRegion] = useState(CASABLANCA);

  useEffect(() => {
    void (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;
      const loc = await Location.getCurrentPositionAsync({});
      setRegion({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    })();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ScreenHeader
          title="Accueil"
          subtitle="Artisans à proximité et demande rapide"
        />
        <Button mode="contained" onPress={() => router.push("/request/new")}>
          Nouvelle demande
        </Button>
      </View>

      <MapView style={styles.map} provider={PROVIDER_GOOGLE} region={region}>
        <Marker coordinate={{ latitude: region.latitude, longitude: region.longitude }} title="Vous" />
      </MapView>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => router.push("/request/new")}
        label="Dépannage"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  header: { padding: 16, paddingBottom: 8, backgroundColor: "#fff" },
  map: { flex: 1 },
  fab: { position: "absolute", right: 16, bottom: 24, backgroundColor: "#16a34a" },
});
