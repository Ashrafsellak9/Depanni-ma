import { useRouter } from "expo-router";
import { useState, type ReactElement } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Button } from "react-native-paper";

import { OtpInput } from "@/src/components/auth/OtpInput";
import { getApiErrorMessage } from "@/src/lib/api";
import { useOtpCountdown } from "@/src/hooks/useOtpCountdown";
import { useAuthStore } from "@/src/store/authStore";

export default function VerifyOtpScreen(): ReactElement {
  const router = useRouter();
  const pendingPhone = useAuthStore((s) => s.pendingPhone);
  const otpPurpose = useAuthStore((s) => s.otpPurpose);
  const verifyOtp = useAuthStore((s) => s.verifyOtp);
  const resendOtp = useAuthStore((s) => s.resendOtp);

  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const { formatted, canResend, reset } = useOtpCountdown(Boolean(pendingPhone));

  const onSubmit = async () => {
    setError(null);
    if (code.length !== 6) {
      setError("Saisissez les 6 chiffres du code");
      return;
    }
    setLoading(true);
    try {
      await verifyOtp(code, otpPurpose);
      router.replace("/(tabs)");
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const onResend = async () => {
    if (!canResend) return;
    setResending(true);
    setError(null);
    try {
      await resendOtp();
      reset();
      setCode("");
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setResending(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vérification SMS</Text>
      <Text style={styles.subtitle}>Code envoyé au {pendingPhone ?? "votre numéro"}</Text>

      <OtpInput value={code} onChange={setCode} disabled={loading} />

      <Text style={styles.timer}>
        {canResend ? "Vous pouvez renvoyer le code" : `Renvoi possible dans ${formatted}`}
      </Text>

      <TouchableOpacity onPress={onResend} disabled={!canResend || resending}>
        <Text style={[styles.resend, !canResend && styles.resendDisabled]}>
          {resending ? "Envoi…" : "Renvoyer le SMS"}
        </Text>
      </TouchableOpacity>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Button
        mode="contained"
        onPress={onSubmit}
        loading={loading}
        disabled={loading || code.length !== 6}
        style={styles.submit}
      >
        Valider
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: "center", backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "700", color: "#14532d" },
  subtitle: { marginTop: 8, marginBottom: 28, color: "#64748b" },
  timer: { marginTop: 20, textAlign: "center", color: "#64748b", fontSize: 13 },
  resend: {
    marginTop: 8,
    textAlign: "center",
    color: "#16a34a",
    fontWeight: "700",
    fontSize: 15,
  },
  resendDisabled: { color: "#94a3b8" },
  error: { color: "#dc2626", marginTop: 12, textAlign: "center" },
  submit: { marginTop: 20 },
});
