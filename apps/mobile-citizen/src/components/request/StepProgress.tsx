import { StyleSheet, Text, View } from "react-native";

const LABELS = ["Catégorie", "Type", "Description", "Lieu", "Urgence", "Récap"];

interface StepProgressProps {
  step: number;
}

export function StepProgress({ step }: StepProgressProps) {
  return (
    <View style={styles.wrap}>
      <View style={styles.barRow}>
        {LABELS.map((_, i) => (
          <View key={i} style={[styles.segment, i + 1 <= step && styles.segmentActive]} />
        ))}
      </View>
      <Text style={styles.label}>
        Étape {step}/{LABELS.length} — {LABELS[step - 1]}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 16 },
  barRow: { flexDirection: "row", gap: 4 },
  segment: { flex: 1, height: 4, borderRadius: 2, backgroundColor: "#e2e8f0" },
  segmentActive: { backgroundColor: "#16a34a" },
  label: { marginTop: 8, fontSize: 12, color: "#64748b", fontWeight: "600" },
});
