import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import type { UserRole } from "@depanni/types";

export default function CitizenHomeScreen() {
  const role: UserRole = "CITIZEN";

  return (
    <View style={styles.container}>
      <Text style={styles.title}>DEPANNI.ma</Text>
      <Text style={styles.subtitle}>Application citoyen — {role}</Text>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Demander un dépannage</Text>
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
    backgroundColor: "#f0fdf4",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#15803d",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 32,
  },
  button: {
    backgroundColor: "#16a34a",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
