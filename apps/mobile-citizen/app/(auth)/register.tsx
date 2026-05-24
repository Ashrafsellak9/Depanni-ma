import { useRouter } from "expo-router";
import { useState, type ReactElement } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text } from "react-native";
import { Button, TextInput } from "react-native-paper";

import { PasswordStrength } from "@/src/components/auth/PasswordStrength";
import { PhoneInput } from "@/src/components/auth/PhoneInput";
import { getApiErrorMessage } from "@/src/lib/api";
import { isValidMoroccanLocal, toE164Morocco } from "@/src/lib/phone";
import { requestNotificationPermission } from "@/src/services/notifications";
import { useAuthStore } from "@/src/store/authStore";

export default function RegisterScreen(): ReactElement {
  const router = useRouter();
  const register = useAuthStore((s) => s.register);

  const [firstName, setFirstName] = useState("");
  const [phoneLocal, setPhoneLocal] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    setError(null);
    if (firstName.trim().length < 2) {
      setError("Prénom requis (2 caractères minimum)");
      return;
    }
    if (!isValidMoroccanLocal(phoneLocal)) {
      setError("Numéro marocain invalide");
      return;
    }
    if (password.length < 8) {
      setError("Mot de passe trop court");
      return;
    }

    setLoading(true);
    try {
      await requestNotificationPermission();
      const phone = toE164Morocco(phoneLocal);
      await register({
        firstName: firstName.trim(),
        phone,
        password,
        ...(email.trim() ? { email: email.trim() } : {}),
      });
      router.push("/(auth)/verify-otp");
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Créer un compte</Text>
        <Text style={styles.subtitle}>Inscription citoyen DEPANNI.ma</Text>

        <TextInput
          label="Prénom"
          value={firstName}
          onChangeText={setFirstName}
          style={styles.input}
          mode="outlined"
        />
        <PhoneInput value={phoneLocal} onChange={setPhoneLocal} />
        <TextInput
          label="Email (optionnel)"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.input}
          mode="outlined"
        />
        <TextInput
          label="Mot de passe"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
          mode="outlined"
        />
        <PasswordStrength password={password} />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Button mode="contained" onPress={onSubmit} loading={loading} disabled={loading}>
          Continuer
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: "#fff" },
  container: { padding: 24, paddingBottom: 48 },
  title: { fontSize: 24, fontWeight: "700", color: "#14532d" },
  subtitle: { marginTop: 6, marginBottom: 20, color: "#64748b" },
  input: { marginBottom: 12, backgroundColor: "#fff" },
  error: { color: "#dc2626", marginBottom: 12 },
});
