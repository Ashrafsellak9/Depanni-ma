import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState, type ReactElement } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Button, TextInput } from "react-native-paper";

import { PasswordStrength } from "@/src/components/auth/PasswordStrength";
import { PhoneInput } from "@/src/components/auth/PhoneInput";
import { getApiErrorMessage } from "@/src/lib/api";
import {
  isEmail,
  isStrongPassword,
  isValidMoroccanLocal,
  toE164Morocco,
} from "@/src/lib/phone";
import { useAuthStore } from "@/src/store/authStore";

type PickedFile = { uri: string; name: string; type: string };

async function pickKycFile(): Promise<PickedFile | null> {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) return null;

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    quality: 0.85,
  });
  if (result.canceled || !result.assets[0]) return null;

  const asset = result.assets[0];
  return {
    uri: asset.uri,
    name: asset.fileName ?? `kyc-${Date.now()}.jpg`,
    type: asset.mimeType ?? "image/jpeg",
  };
}

export default function RegisterScreen(): ReactElement {
  const router = useRouter();
  const register = useAuthStore((s) => s.register);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneLocal, setPhoneLocal] = useState("");
  const [password, setPassword] = useState("");
  const [cinNumber, setCinNumber] = useState("");
  const [cinDocument, setCinDocument] = useState<PickedFile | null>(null);
  const [tradeLicense, setTradeLicense] = useState<PickedFile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    setError(null);

    if (firstName.trim().length < 2) {
      setError("Prénom requis (2 caractères minimum)");
      return;
    }
    if (lastName.trim().length < 2) {
      setError("Nom requis (2 caractères minimum)");
      return;
    }
    if (!isEmail(email)) {
      setError("Email invalide");
      return;
    }
    if (!isValidMoroccanLocal(phoneLocal)) {
      setError("Numéro marocain invalide");
      return;
    }
    if (!isStrongPassword(password)) {
      setError("Mot de passe : 8 caractères, 1 majuscule et 1 chiffre minimum");
      return;
    }

    const phone = toE164Morocco(phoneLocal);
    if (!phone) {
      setError("Numéro marocain invalide");
      return;
    }

    setLoading(true);
    try {
      await register({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone,
        password,
        ...(cinNumber.trim() ? { cinNumber: cinNumber.trim() } : {}),
        ...(cinDocument ? { cinDocument } : {}),
        ...(tradeLicense ? { tradeLicense } : {}),
      });
      router.push("/(auth)/verify-otp" as never);
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
        <Text style={styles.title}>Inscription artisan</Text>
        <Text style={styles.subtitle}>DEPANNI Pro — validation KYC après OTP</Text>

        <TextInput
          label="Prénom"
          value={firstName}
          onChangeText={setFirstName}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Nom"
          value={lastName}
          onChangeText={setLastName}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Email professionnel"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          mode="outlined"
          style={styles.input}
        />
        <PhoneInput value={phoneLocal} onChange={setPhoneLocal} />
        <TextInput
          label="Mot de passe"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          mode="outlined"
          style={styles.input}
        />
        <PasswordStrength password={password} />

        <TextInput
          label="CIN (optionnel)"
          value={cinNumber}
          onChangeText={setCinNumber}
          mode="outlined"
          style={styles.input}
        />

        <Text style={styles.kycLabel}>Documents KYC (recommandés)</Text>
        <View style={styles.kycRow}>
          <Button
            mode="outlined"
            icon="card-account-details"
            onPress={async () => {
              const file = await pickKycFile();
              if (file) setCinDocument(file);
            }}
            style={styles.kycBtn}
          >
            {cinDocument ? "CIN ✓" : "CIN"}
          </Button>
          <Button
            mode="outlined"
            icon="file-document"
            onPress={async () => {
              const file = await pickKycFile();
              if (file) setTradeLicense(file);
            }}
            style={styles.kycBtn}
          >
            {tradeLicense ? "Patente ✓" : "Patente"}
          </Button>
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Button mode="contained" onPress={() => void onSubmit()} loading={loading} disabled={loading}>
          Continuer
        </Button>

        <Button mode="text" onPress={() => router.replace("/(auth)/login" as never)} style={styles.link}>
          Déjà un compte ? Se connecter
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: "#f0fdf4" },
  container: { padding: 24, paddingBottom: 48 },
  title: { fontSize: 24, fontWeight: "800", color: "#14532d" },
  subtitle: { marginTop: 6, marginBottom: 20, color: "#64748b" },
  input: { marginBottom: 12, backgroundColor: "#fff" },
  kycLabel: { fontWeight: "600", color: "#334155", marginBottom: 8 },
  kycRow: { flexDirection: "row", gap: 8, marginBottom: 16 },
  kycBtn: { flex: 1 },
  error: { color: "#dc2626", marginBottom: 12 },
  link: { marginTop: 12 },
});
