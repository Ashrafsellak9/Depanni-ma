import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { useMutation } from "@tanstack/react-query";
import Slider from "@react-native-community/slider";

import { getApiErrorMessage } from "@/src/lib/api";
import { submitOffer } from "@/src/services/artisan";

export default function SubmitOfferScreen() {
  const { jobId } = useLocalSearchParams<{ jobId: string }>();
  const router = useRouter();

  const [price, setPrice] = useState(200);
  const [etaMinutes, setEtaMinutes] = useState(30);
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  const mut = useMutation({
    mutationFn: () =>
      submitOffer(jobId ?? "", {
        price,
        eta_minutes: Math.round(etaMinutes),
        message: message.trim() || undefined,
      }),
    onSuccess: () => router.back(),
    onError: (e) => setError(getApiErrorMessage(e)),
  });

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Votre offre</Text>
        <Text style={styles.label}>Prix proposé : {Math.round(price)} MAD</Text>
        <Slider
          minimumValue={50}
          maximumValue={2000}
          step={10}
          value={price}
          onValueChange={setPrice}
          minimumTrackTintColor="#15803d"
        />

        <Text style={styles.label}>Délai d&apos;arrivée : {Math.round(etaMinutes)} min</Text>
        <Slider
          minimumValue={15}
          maximumValue={180}
          step={5}
          value={etaMinutes}
          onValueChange={setEtaMinutes}
          minimumTrackTintColor="#15803d"
        />

        <TextInput
          label="Message au client (optionnel)"
          value={message}
          onChangeText={setMessage}
          mode="outlined"
          multiline
          style={styles.input}
        />

        {error && <Text style={styles.error}>{error}</Text>}

        <Button mode="contained" onPress={() => mut.mutate()} loading={mut.isPending}>
          Envoyer l&apos;offre
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: "#f8fafc" },
  container: { padding: 20 },
  title: { fontSize: 22, fontWeight: "800", color: "#14532d", marginBottom: 16 },
  label: { fontWeight: "600", color: "#334155", marginTop: 12 },
  input: { marginVertical: 16, backgroundColor: "#fff" },
  error: { color: "#dc2626", marginBottom: 12 },
});
