import { StyleSheet, Text, TextInput, View } from "react-native";

import { extractLocalDigits, formatLocalPhoneDisplay } from "@/src/lib/phone";

interface PhoneInputProps {
  value: string;
  onChange: (localDigits: string) => void;
  label?: string;
  error?: string;
  editable?: boolean;
}

export function PhoneInput({
  value,
  onChange,
  label = "Téléphone",
  error,
  editable = true,
}: PhoneInputProps) {
  const display = formatLocalPhoneDisplay(value);

  return (
    <View style={styles.wrap}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={[styles.row, error ? styles.rowError : null]}>
        <View style={styles.prefix}>
          <Text style={styles.flag}>🇲🇦</Text>
          <Text style={styles.code}>+212</Text>
        </View>
        <TextInput
          style={styles.input}
          value={display}
          onChangeText={(text) => onChange(extractLocalDigits(text))}
          keyboardType="phone-pad"
          placeholder="6 12 34 56 78"
          placeholderTextColor="#94a3b8"
          maxLength={14}
          editable={editable}
        />
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 12 },
  label: { marginBottom: 6, fontSize: 14, fontWeight: "600", color: "#334155" },
  row: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 10,
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  rowError: { borderColor: "#dc2626" },
  prefix: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 14,
    backgroundColor: "#f1f5f9",
    borderRightWidth: 1,
    borderRightColor: "#e2e8f0",
    gap: 6,
  },
  flag: { fontSize: 18 },
  code: { fontWeight: "700", color: "#14532d" },
  input: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 14,
    fontSize: 16,
    color: "#0f172a",
  },
  error: { marginTop: 4, fontSize: 12, color: "#dc2626" },
});
