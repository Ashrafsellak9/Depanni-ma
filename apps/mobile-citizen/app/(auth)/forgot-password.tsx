import { useRouter } from "expo-router";
import { useState, type ReactElement } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Button, TextInput } from "react-native-paper";

import { OtpInput } from "@/src/components/auth/OtpInput";
import { PasswordStrength } from "@/src/components/auth/PasswordStrength";
import { PhoneInput } from "@/src/components/auth/PhoneInput";
import { getApiErrorMessage } from "@/src/lib/api";
import { useOtpCountdown } from "@/src/hooks/useOtpCountdown";
import { isValidMoroccanLocal, toE164Morocco } from "@/src/lib/phone";
import * as authService from "@/src/services/auth";

type Step = "phone" | "otp" | "password";

export default function ForgotPasswordScreen(): ReactElement {
  const router = useRouter();

  const [step, setStep] = useState<Step>("phone");
  const [phoneLocal, setPhoneLocal] = useState("");
  const [phoneE164, setPhoneE164] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const { formatted, canResend, reset } = useOtpCountdown(step === "otp");

  const sendOtp = async () => {
    setError(null);
    if (!isValidMoroccanLocal(phoneLocal)) {
      setError("Numéro invalide");
      return;
    }
    const phone = toE164Morocco(phoneLocal);
    setLoading(true);
    try {
      await authService.forgotPassword(phone);
      setPhoneE164(phone);
      setStep("otp");
      reset();
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const onResend = async () => {
    if (!canResend || !phoneE164) return;
    setResending(true);
    try {
      await authService.resendOtp({ phone: phoneE164, purpose: "RESET" });
      reset();
      setCode("");
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setResending(false);
    }
  };

  const goToPassword = () => {
    if (code.length !== 6) {
      setError("Saisissez le code à 6 chiffres");
      return;
    }
    setError(null);
    setStep("password");
  };

  const resetPassword = async () => {
    setError(null);
    setLoading(true);
    try {
      await authService.resetPassword({
        phone: phoneE164,
        code,
        password,
      });
      router.replace("/(auth)/login");
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
      <Text style={styles.title}>Mot de passe oublié</Text>

      {step === "phone" && (
        <View>
          <Text style={styles.subtitle}>Entrez votre numéro pour recevoir un code SMS</Text>
          <PhoneInput value={phoneLocal} onChange={setPhoneLocal} />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Button mode="contained" onPress={sendOtp} loading={loading}>
            Envoyer le code
          </Button>
        </View>
      )}

      {step === "otp" && (
        <View>
          <Text style={styles.subtitle}>Code envoyé au {phoneE164}</Text>
          <OtpInput value={code} onChange={setCode} />
          <Text style={styles.timer}>
            {canResend ? "Vous pouvez renvoyer le code" : `Renvoi dans ${formatted}`}
          </Text>
          <TouchableOpacity onPress={onResend} disabled={!canResend || resending}>
            <Text style={[styles.resend, !canResend && styles.resendDisabled]}>
              {resending ? "Envoi…" : "Renvoyer le SMS"}
            </Text>
          </TouchableOpacity>
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Button mode="contained" onPress={goToPassword} style={styles.mt}>
            Continuer
          </Button>
        </View>
      )}

      {step === "password" && (
        <View>
          <Text style={styles.subtitle}>Choisissez un nouveau mot de passe</Text>
          <TextInput
            label="Nouveau mot de passe"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            mode="outlined"
            style={styles.input}
          />
          <PasswordStrength password={password} />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Button mode="contained" onPress={resetPassword} loading={loading}>
            Réinitialiser
          </Button>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: "center", backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "700", color: "#14532d", marginBottom: 8 },
  subtitle: { color: "#64748b", marginBottom: 20 },
  input: { marginBottom: 12 },
  error: { color: "#dc2626", marginBottom: 12 },
  mt: { marginTop: 16 },
  timer: { marginTop: 16, textAlign: "center", color: "#64748b", fontSize: 13 },
  resend: {
    marginTop: 8,
    textAlign: "center",
    color: "#16a34a",
    fontWeight: "700",
  },
  resendDisabled: { color: "#94a3b8" },
});
