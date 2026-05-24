import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import { Button, TextInput } from "react-native-paper";

import { getApiErrorMessage } from "@/src/lib/api";
import { useAuthStore } from "@/src/store/authStore";

export default function RegisterScreen() {
  const router = useRouter();
  const register = useAuthStore((s) => s.register);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const update = (key: keyof typeof form) => (value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const onSubmit = async () => {
    setError(null);
    setLoading(true);
    try {
      await register({ ...form, locale: "fr" });
      router.push("/(auth)/verify-otp");
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>Inscription citoyen</Text>
      <TextInput label="Prénom" value={form.firstName} onChangeText={update("firstName")} style={styles.input} />
      <TextInput label="Nom" value={form.lastName} onChangeText={update("lastName")} style={styles.input} />
      <TextInput
        label="Email"
        value={form.email}
        onChangeText={update("email")}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />
      <TextInput
        label="Téléphone (+212…)"
        value={form.phone}
        onChangeText={update("phone")}
        keyboardType="phone-pad"
        style={styles.input}
      />
      <TextInput
        label="Mot de passe"
        value={form.password}
        onChangeText={update("password")}
        secureTextEntry
        style={styles.input}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Button mode="contained" onPress={onSubmit} loading={loading} disabled={loading}>
        Continuer
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, paddingBottom: 48, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "700", color: "#14532d", marginBottom: 16 },
  input: { marginBottom: 12, backgroundColor: "#fff" },
  error: { color: "#dc2626", marginBottom: 12 },
});
