import { useRouter } from "expo-router";
import { useState, type ReactElement } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from "react-native";
import { Button, TextInput } from "react-native-paper";

import { getApiErrorMessage } from "@/src/lib/api";
import { isEmail, isValidMoroccanLocal, toE164Morocco } from "@/src/lib/phone";
import { useAuthStore } from "@/src/store/authStore";

export default function LoginScreen(): ReactElement {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);

  const [usePhone, setUsePhone] = useState(true);
  const [email, setEmail] = useState("");
  const [phoneLocal, setPhoneLocal] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    setError(null);
    if (usePhone && !isValidMoroccanLocal(phoneLocal)) {
      setError("Numéro invalide");
      return;
    }
    if (!usePhone && !isEmail(email)) {
      setError("Email invalide");
      return;
    }

    setLoading(true);
    try {
      if (usePhone) {
        await login({ phone: toE164Morocco(phoneLocal), password });
      } else {
        await login({ email: email.trim(), password });
      }
      router.replace("/(tabs)" as never);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Text style={styles.brand}>DEPANNI Pro</Text>
      <Text style={styles.subtitle}>Espace artisan</Text>

      <View style={styles.toggleRow}>
        <Button mode={usePhone ? "contained" : "outlined"} onPress={() => setUsePhone(true)}>
          Téléphone
        </Button>
        <Button mode={!usePhone ? "contained" : "outlined"} onPress={() => setUsePhone(false)}>
          Email
        </Button>
      </View>

      {usePhone ? (
        <TextInput
          label="Téléphone"
          value={phoneLocal}
          onChangeText={setPhoneLocal}
          keyboardType="phone-pad"
          mode="outlined"
          style={styles.input}
        />
      ) : (
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          mode="outlined"
          style={styles.input}
        />
      )}

      <TextInput
        label="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        mode="outlined"
        style={styles.input}
      />

      {error && <Text style={styles.error}>{error}</Text>}

      <Button mode="contained" onPress={() => void onSubmit()} loading={loading} style={styles.submit}>
        Connexion
      </Button>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24, backgroundColor: "#f0fdf4" },
  brand: { fontSize: 28, fontWeight: "800", color: "#14532d", textAlign: "center" },
  subtitle: { textAlign: "center", color: "#64748b", marginBottom: 24 },
  toggleRow: { flexDirection: "row", gap: 8, marginBottom: 16 },
  input: { marginBottom: 12, backgroundColor: "#fff" },
  error: { color: "#dc2626", marginBottom: 8 },
  submit: { marginTop: 8 },
});
