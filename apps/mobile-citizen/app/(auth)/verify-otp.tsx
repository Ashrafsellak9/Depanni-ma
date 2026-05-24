import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button, TextInput } from "react-native-paper";

import { getApiErrorMessage } from "@/src/lib/api";
import { useAuthStore } from "@/src/store/authStore";

export default function VerifyOtpScreen() {
  const router = useRouter();
  const pendingPhone = useAuthStore((s) => s.pendingPhone);
  const verifyOtp = useAuthStore((s) => s.verifyOtp);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    setError(null);
    setLoading(true);
    try {
      await verifyOtp(code.trim());
      router.replace("/(tabs)");
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vérification OTP</Text>
      <Text style={styles.subtitle}>
        Code envoyé au {pendingPhone ?? "votre numéro"}
      </Text>

      <TextInput
        label="Code à 6 chiffres"
        value={code}
        onChangeText={setCode}
        keyboardType="number-pad"
        maxLength={6}
        style={styles.input}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Button mode="contained" onPress={onSubmit} loading={loading} disabled={loading || code.length < 6}>
        Valider
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: "center", backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "700", color: "#14532d" },
  subtitle: { marginTop: 8, marginBottom: 20, color: "#64748b" },
  input: { marginBottom: 12, backgroundColor: "#fff" },
  error: { color: "#dc2626", marginBottom: 12 },
});
