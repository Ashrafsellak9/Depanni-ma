import * as Location from "expo-location";
import { useCallback, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TextInput, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, type Region } from "react-native-maps";
import { Button } from "react-native-paper";

import { GOOGLE_MAPS_API_KEY } from "@/src/lib/config";

interface LocationPickerProps {
  lat: number;
  lng: number;
  address: string;
  city: string;
  onChange: (patch: { lat: number; lng: number; address: string; city: string }) => void;
  error?: string;
}

export function LocationPicker({ lat, lng, address, city, onChange, error }: LocationPickerProps) {
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState("");

  const region: Region = {
    latitude: lat,
    longitude: lng,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  };

  const onRegionChange = useCallback(
    (r: Region) => {
      onChange({ lat: r.latitude, lng: r.longitude, address, city });
    },
    [address, city, onChange],
  );

  const useMyLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") return;
    const loc = await Location.getCurrentPositionAsync({});
    onChange({
      lat: loc.coords.latitude,
      lng: loc.coords.longitude,
      address: address || "Position actuelle",
      city: city || "Casablanca",
    });
  };

  const searchPlaces = async () => {
    if (!query.trim() || !GOOGLE_MAPS_API_KEY) {
      onChange({ lat, lng, address: query || address, city });
      return;
    }
    setSearching(true);
    try {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        `${query}, Maroc`,
      )}&key=${GOOGLE_MAPS_API_KEY}`;
      const res = await fetch(url);
      const json = (await res.json()) as {
        results?: Array<{
          formatted_address: string;
          geometry: { location: { lat: number; lng: number } };
          address_components?: Array<{ types: string[]; long_name: string }>;
        }>;
      };
      const first = json.results?.[0];
      if (first) {
        const cityComp = first.address_components?.find((c) =>
          c.types.includes("locality"),
        )?.long_name;
        onChange({
          lat: first.geometry.location.lat,
          lng: first.geometry.location.lng,
          address: first.formatted_address,
          city: cityComp ?? city,
        });
      }
    } finally {
      setSearching(false);
    }
  };

  return (
    <View style={styles.flex}>
      <Text style={styles.title}>Où intervenir ?</Text>
      <TextInput
        style={styles.search}
        placeholder="Rechercher une adresse…"
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={searchPlaces}
        returnKeyType="search"
      />
      {searching ? <ActivityIndicator style={styles.loader} /> : null}
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        region={region}
        onRegionChangeComplete={onRegionChange}
      >
        <Marker
          coordinate={{ latitude: lat, longitude: lng }}
          draggable
          onDragEnd={(e) =>
            onChange({
              lat: e.nativeEvent.coordinate.latitude,
              lng: e.nativeEvent.coordinate.longitude,
              address,
              city,
            })
          }
        />
      </MapView>
      <TextInput
        style={styles.input}
        placeholder="Adresse complète"
        value={address}
        onChangeText={(a) => onChange({ lat, lng, address: a, city })}
      />
      <TextInput
        style={styles.input}
        placeholder="Ville"
        value={city}
        onChangeText={(c) => onChange({ lat, lng, address, city: c })}
      />
      <Button mode="outlined" onPress={useMyLocation} icon="crosshairs-gps">
        Ma position
      </Button>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  title: { fontSize: 18, fontWeight: "700", color: "#14532d", marginBottom: 8 },
  search: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    backgroundColor: "#fff",
  },
  map: { height: 220, borderRadius: 12, marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    backgroundColor: "#fff",
  },
  loader: { marginBottom: 8 },
  error: { color: "#dc2626", marginTop: 4 },
});
