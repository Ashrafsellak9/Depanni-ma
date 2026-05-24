import { useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function ArtisanProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profil artisan</Text>
      <Text style={styles.subtitle}>ID : {id}</Text>
      <Text style={styles.body}>
        Avis, métiers, zone d&apos;intervention et disponibilité — chargés depuis l&apos;API
        `/artisans/:id` dans la prochaine itération.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f8fafc" },
  title: { fontSize: 22, fontWeight: "700", color: "#14532d" },
  subtitle: { marginTop: 8, color: "#64748b" },
  body: { marginTop: 16, color: "#334155", lineHeight: 22 },
});
