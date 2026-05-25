import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

export function SearchingBanner() {
  return (
    <View style={styles.wrap}>
      <ActivityIndicator color="#fff" />
      <Text style={styles.title}>Recherche en cours…</Text>
      <Text style={styles.sub}>Nous contactons les artisans disponibles près de vous.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: "#15803d",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  title: { color: "#fff", fontWeight: "700", fontSize: 15, flex: 1 },
  sub: { color: "#dcfce7", fontSize: 12, marginTop: 2 },
});
