import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from "react-native";
import { Button, TextInput } from "react-native-paper";

import { getApiErrorMessage } from "@/src/lib/api";
import { useAuthStore } from "@/src/store/authStore";

export default function LoginScreen() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    setError(null);
    setLoading(true);
    try {
      await login(email.trim(), password);
      router.replace("/(tabs)");
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
      <Text style={styles.title}>Connexion</Text>
      <Text style={styles.subtitle}>Accédez à vos missions et demandes</Text>

      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />
      <TextInput
        label="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Button mode="contained" onPress={onSubmit} loading={loading} disabled={loading}>
        Se connecter
      </Button>

      <Link href="/(auth)/register" style={styles.link}>
        <Text style={styles.linkText}>Pas de compte ? S&apos;inscrire</Text>
      </Link>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: "center", backgroundColor: "#fff" },
  title: { fontSize: 26, fontWeight: "700", color: "#14532d" },
  subtitle: { marginTop: 6, marginBottom: 20, color: "#64748b" },
  input: { marginBottom: 12, backgroundColor: "#fff" },
  error: { color: "#dc2626", marginBottom: 12 },
  link: { marginTop: 16, alignSelf: "center" },
  linkText: { color: "#16a34a", fontWeight: "600" },
});
