import { StyleSheet, Text, View } from "react-native";

import { evaluatePasswordStrength } from "@/src/lib/password-strength";

interface PasswordStrengthProps {
  password: string;
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  if (!password) return null;

  const result = evaluatePasswordStrength(password);
  const widthPct = Math.min(100, (result.score / 6) * 100);

  return (
    <View style={styles.wrap}>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${widthPct}%`, backgroundColor: result.color }]} />
      </View>
      <Text style={[styles.label, { color: result.color }]}>Force : {result.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 12 },
  track: {
    height: 4,
    backgroundColor: "#e2e8f0",
    borderRadius: 4,
    overflow: "hidden",
  },
  fill: { height: "100%", borderRadius: 4 },
  label: { marginTop: 4, fontSize: 12, fontWeight: "600" },
});
