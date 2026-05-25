import Slider from "@react-native-community/slider";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

import type { JobUrgency } from "@/src/types/job";

const URGENCIES: { key: JobUrgency; label: string; desc: string }[] = [
  { key: "NOW", label: "Urgent", desc: "Dans l'heure" },
  { key: "IN2H", label: "2 heures", desc: "Aujourd'hui" },
  { key: "SCHEDULED", label: "Planifié", desc: "Date choisie" },
];

interface UrgencyBudgetProps {
  urgency: JobUrgency;
  budgetMin: number;
  budgetMax: number;
  onUrgencyChange: (u: JobUrgency) => void;
  onBudgetChange: (min: number, max: number) => void;
  error?: string;
}

export function UrgencyBudget({
  urgency,
  budgetMin,
  budgetMax,
  onUrgencyChange,
  onBudgetChange,
  error,
}: UrgencyBudgetProps) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const onUrgencyPress = (u: JobUrgency) => {
    scale.value = withSpring(1.05, {}, () => {
      scale.value = withSpring(1);
    });
    onUrgencyChange(u);
  };

  return (
    <View style={styles.flex}>
      <Text style={styles.title}>Urgence & budget</Text>
      <View style={styles.urgencyRow}>
        {URGENCIES.map((u) => {
          const active = urgency === u.key;
          return (
            <Pressable key={u.key} style={styles.urgencyCol} onPress={() => onUrgencyPress(u.key)}>
              <Animated.View style={active ? animStyle : undefined}>
                <View style={[styles.urgencyBtn, active && styles.urgencyActive]}>
                  <Text style={[styles.urgencyLabel, active && styles.urgencyLabelActive]}>{u.label}</Text>
                </View>
              </Animated.View>
              <Text style={styles.urgencyDesc}>{u.desc}</Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.budgetLabel}>Budget indicatif (MAD)</Text>
      <Text style={styles.budgetValue}>
        {Math.round(budgetMin)} — {Math.round(budgetMax)} MAD
      </Text>
      <Text style={styles.sliderHint}>Minimum</Text>
      <Slider
        minimumValue={50}
        maximumValue={2000}
        step={50}
        value={budgetMin}
        onValueChange={(v) => onBudgetChange(v, Math.max(v, budgetMax))}
        minimumTrackTintColor="#16a34a"
        thumbTintColor="#15803d"
      />
      <Text style={styles.sliderHint}>Maximum</Text>
      <Slider
        minimumValue={50}
        maximumValue={5000}
        step={50}
        value={budgetMax}
        onValueChange={(v) => onBudgetChange(Math.min(v, budgetMin), v)}
        minimumTrackTintColor="#16a34a"
        thumbTintColor="#15803d"
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  title: { fontSize: 18, fontWeight: "700", color: "#14532d", marginBottom: 16 },
  urgencyRow: { flexDirection: "row", gap: 8, marginBottom: 24 },
  urgencyCol: { flex: 1 },
  urgencyBtn: {
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
  },
  urgencyActive: { backgroundColor: "#16a34a" },
  urgencyLabel: { fontWeight: "700", color: "#334155" },
  urgencyLabelActive: { color: "#fff" },
  urgencyDesc: { fontSize: 10, textAlign: "center", color: "#64748b", marginTop: 4 },
  budgetLabel: { fontWeight: "600", color: "#334155" },
  budgetValue: { fontSize: 20, fontWeight: "800", color: "#15803d", marginVertical: 8 },
  sliderHint: { fontSize: 12, color: "#64748b", marginTop: 8 },
  error: { color: "#dc2626", marginTop: 8 },
});
