import { StyleSheet, Text, View } from "react-native";

interface KpiCardsProps {
  revenueToday?: number;
  missionsMonth?: number;
  rating?: number;
  responseRate?: number;
}

export function KpiCards({
  revenueToday = 0,
  missionsMonth = 0,
  rating = 0,
  responseRate = 0,
}: KpiCardsProps) {
  const items = [
    { label: "Revenus jour", value: `${revenueToday.toFixed(0)} MAD` },
    { label: "Missions ce mois", value: String(missionsMonth) },
    { label: "Note moyenne", value: rating > 0 ? rating.toFixed(1) : "—" },
    { label: "Taux réponse", value: responseRate > 0 ? `${responseRate}%` : "—" },
  ];

  return (
    <View style={styles.grid}>
      {items.map((item) => (
        <View key={item.label} style={styles.card}>
          <Text style={styles.value}>{item.value}</Text>
          <Text style={styles.label}>{item.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10, padding: 16 },
  card: {
    width: "47%",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  value: { fontSize: 20, fontWeight: "800", color: "#14532d" },
  label: { marginTop: 4, fontSize: 12, color: "#64748b" },
});
