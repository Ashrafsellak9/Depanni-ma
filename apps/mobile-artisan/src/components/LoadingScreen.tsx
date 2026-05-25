import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

interface LoadingScreenProps {
  label?: string;
}

export function LoadingScreen({ label = "Chargement…" }: LoadingScreenProps) {
  return (
    <View style={styles.wrap}>
      <ActivityIndicator size="large" color="#15803d" />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#f8fafc" },
  label: { marginTop: 12, color: "#64748b", fontSize: 15 },
});
