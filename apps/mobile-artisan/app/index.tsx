import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import type { UserRole } from "@depanni/types";

export default function ArtisanHomeScreen() {
  const role: UserRole = "ARTISAN";

  return (
    <View style={styles.container}>
      <Text style={styles.title}>DEPANNI Pro</Text>
      <Text style={styles.subtitle}>Application artisan — {role}</Text>
      <TouchableOpacity style={styles.buttonAvailable}>
        <Text style={styles.buttonText}>Disponible</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Voir les demandes</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#14532d",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#dcfce7",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#86efac",
    marginBottom: 32,
  },
  buttonAvailable: {
    backgroundColor: "#22c55e",
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 24,
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#166534",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#4ade80",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
