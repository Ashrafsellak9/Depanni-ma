import { useRouter } from "expo-router";
import { useState, type ReactElement } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Avatar, Button, Chip, TextInput } from "react-native-paper";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getApiErrorMessage } from "@/src/lib/api";
import { useArtisanProfile } from "@/src/hooks/useArtisanProfile";
import { updateProfile } from "@/src/services/artisan";
import { useAuthStore } from "@/src/store/authStore";

export default function ProfileScreen(): ReactElement {
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);
  const qc = useQueryClient();
  const { data: profile, isLoading } = useArtisanProfile();

  const [bio, setBio] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [error, setError] = useState<string | null>(null);

  const saveMut = useMutation({
    mutationFn: () =>
      updateProfile({
        bio: bio.trim() || undefined,
        hourlyRate: hourlyRate ? Number(hourlyRate) : undefined,
      }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["artisan-profile"] });
      setError(null);
    },
    onError: (e) => setError(getApiErrorMessage(e)),
  });

  const name = profile ? `${profile.firstName} ${profile.lastName}` : "Artisan";

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        {profile?.avatar ? (
          <Avatar.Image size={80} source={{ uri: profile.avatar }} />
        ) : (
          <Avatar.Text size={80} label={name.slice(0, 2).toUpperCase()} />
        )}
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.meta}>
          KYC : {profile?.kycStatus ?? "—"} · Rayon {profile?.serviceRadiusKm ?? 15} km
        </Text>
      </View>

      <Text style={styles.label}>Spécialités</Text>
      <View style={styles.chips}>
        {(profile?.specialties ?? []).map((s) => (
          <Chip key={s} style={styles.chip}>
            {s}
          </Chip>
        ))}
        {!profile?.specialties?.length && <Text style={styles.muted}>Aucune spécialité</Text>}
      </View>

      <Text style={styles.label}>Zones</Text>
      <View style={styles.chips}>
        {(profile?.zones ?? []).map((z) => (
          <Chip key={z} icon="map-marker" style={styles.chip}>
            {z}
          </Chip>
        ))}
      </View>

      <TextInput
        label="Bio professionnelle"
        value={bio || profile?.bio || ""}
        onChangeText={setBio}
        mode="outlined"
        multiline
        style={styles.input}
      />
      <TextInput
        label="Tarif horaire (MAD)"
        value={hourlyRate || String(profile?.hourlyRate ?? "")}
        onChangeText={setHourlyRate}
        mode="outlined"
        keyboardType="decimal-pad"
        style={styles.input}
      />

      {error && <Text style={styles.error}>{error}</Text>}

      <Button mode="contained" onPress={() => saveMut.mutate()} loading={saveMut.isPending} disabled={isLoading}>
        Enregistrer
      </Button>

      <Button
        mode="outlined"
        style={styles.logout}
        textColor="#dc2626"
        onPress={() =>
          void logout().then(() => router.replace("/(auth)/login" as never))
        }
      >
        Déconnexion
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 48 },
  header: { alignItems: "center", marginBottom: 20 },
  name: { fontSize: 22, fontWeight: "800", color: "#14532d", marginTop: 12 },
  meta: { marginTop: 4, color: "#64748b", fontSize: 13 },
  label: { fontWeight: "700", color: "#334155", marginBottom: 8 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 16 },
  chip: { marginBottom: 4 },
  muted: { color: "#94a3b8" },
  input: { marginBottom: 12, backgroundColor: "#fff" },
  error: { color: "#dc2626", marginBottom: 8 },
  logout: { marginTop: 24, borderColor: "#fecaca" },
});
