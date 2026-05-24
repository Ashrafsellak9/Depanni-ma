import { Link, useRouter } from "expo-router";
import { useState, type ReactElement } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from "react-native";
import { Button, TextInput } from "react-native-paper";

import { PhoneInput } from "@/src/components/auth/PhoneInput";
import { getApiErrorMessage } from "@/src/lib/api";
import { isEmail, isValidMoroccanLocal, toE164Morocco } from "@/src/lib/phone";
import { useAuthStore } from "@/src/store/authStore";

export default function LoginScreen(): ReactElement {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);

  const [usePhone, setUsePhone] = useState(true);
  const [identifier, setIdentifier] = useState("");
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
    if (!usePhone && !isEmail(identifier)) {
      setError("Email invalide");
      return;
    }

    setLoading(true);
    try {
      if (usePhone) {
        await login({ phone: toE164Morocco(phoneLocal), password });
      } else {
        await login({ email: identifier.trim(), password });
      }
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
      <Text style={styles.subtitle}>Téléphone ou email</Text>

      <View style={styles.toggleRow}>
        <Button
          mode={usePhone ? "contained" : "outlined"}
          onPress={() => setUsePhone(true)}
          style={styles.toggleBtn}
        >
          Téléphone
        </Button>
        <Button
          mode={!usePhone ? "contained" : "outlined"}
          onPress={() => setUsePhone(false)}
          style={styles.toggleBtn}
        >
          Email
        </Button>
      </View>

      {usePhone ? (
        <PhoneInput value={phoneLocal} onChange={setPhoneLocal} />
      ) : (
        <TextInput
          label="Email"
          value={identifier}
          onChangeText={setIdentifier}
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.input}
          mode="outlined"
        />
      )}

      <TextInput
        label="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        mode="outlined"
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Button mode="contained" onPress={onSubmit} loading={loading} disabled={loading}>
        Se connecter
      </Button>

      <Link href={"/(auth)/forgot-password" as never} style={styles.forgot}>
        <Text style={styles.forgotText}>Mot de passe oublié ?</Text>
      </Link>

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
  toggleRow: { flexDirection: "row", gap: 8, marginBottom: 12 },
  toggleBtn: { flex: 1 },
  input: { marginBottom: 12, backgroundColor: "#fff" },
  error: { color: "#dc2626", marginBottom: 12 },
  forgot: { marginTop: 16, alignSelf: "center" },
  forgotText: { color: "#64748b", fontWeight: "600" },
  link: { marginTop: 12, alignSelf: "center" },
  linkText: { color: "#16a34a", fontWeight: "600" },
});
