import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

export function LoadingScreen({ label = "Chargement…" }: { label?: string }) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#16a34a" />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0fdf4",
    gap: 12,
  },
  label: {
    color: "#64748b",
    fontSize: 14,
  },
});
