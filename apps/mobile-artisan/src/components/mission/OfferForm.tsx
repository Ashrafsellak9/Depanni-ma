import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { Button, TextInput } from "react-native-paper";
import Slider from "@react-native-community/slider";
import { useMutation } from "@tanstack/react-query";

import { OfferCountdown } from "@/src/components/mission/OfferCountdown";
import { getApiErrorMessage } from "@/src/lib/api";
import { computePriceHints, isOfferWindowOpen } from "@/src/lib/job-offer-window";
import { fetchJob, submitJobOffer } from "@/src/services/jobs";
import type { IncomingJobPayload } from "@/src/types/job-alert";

interface OfferFormProps {
  jobId: string;
  initialJob?: IncomingJobPayload;
}

export function OfferForm({ jobId, initialJob }: OfferFormProps) {
  const router = useRouter();
  const [job, setJob] = useState<IncomingJobPayload | null>(initialJob ?? null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const hints = useMemo(
    () =>
      job
        ? computePriceHints(job.budgetMin, job.budgetMax)
        : { min: 80, recommended: 200, max: 400 },
    [job],
  );

  const [price, setPrice] = useState(hints.recommended);
  const [etaMinutes, setEtaMinutes] = useState(30);
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [assigned, setAssigned] = useState(false);

  useEffect(() => {
    if (initialJob) return;
    void fetchJob(jobId)
      .then((detail) => {
        if (detail.status !== "PENDING" || detail.mission) {
          setAssigned(true);
          return;
        }
        if (!detail.acceptsOffers) {
          setAssigned(true);
          return;
        }
        const payload: IncomingJobPayload = {
          id: detail.id,
          title: detail.title,
          urgency: detail.urgency as IncomingJobPayload["urgency"],
          city: detail.city,
          category: detail.category,
          lat: detail.lat,
          lng: detail.lng,
          budgetMin: detail.budgetMin,
          budgetMax: detail.budgetMax,
          createdAt: detail.createdAt,
        };
        setJob(payload);
        const h = computePriceHints(payload.budgetMin, payload.budgetMax);
        setPrice(h.recommended);
      })
      .catch((e) => setLoadError(getApiErrorMessage(e)));
  }, [jobId, initialJob]);

  useEffect(() => {
    setPrice(hints.recommended);
  }, [hints.recommended]);

  const windowOpen = job ? isOfferWindowOpen(job.createdAt) : false;

  const mut = useMutation({
    mutationFn: () =>
      submitJobOffer(jobId, {
        price: Math.round(price),
        eta_minutes: Math.round(etaMinutes),
        message: message.trim() || undefined,
      }),
    onSuccess: () => router.replace("/(app)/(tabs)/missions" as never),
    onError: (e) => setError(getApiErrorMessage(e)),
  });

  if (assigned) {
    return (
      <View style={styles.center}>
        <Text style={styles.assignedTitle}>Mission déjà attribuée</Text>
        <Text style={styles.assignedSub}>
          Cette demande n&apos;accepte plus d&apos;offres ou a déjà été assignée.
        </Text>
        <Button mode="contained" onPress={() => router.back()}>
          Retour
        </Button>
      </View>
    );
  }

  if (loadError) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{loadError}</Text>
      </View>
    );
  }

  if (!job) {
    return (
      <View style={styles.center}>
        <Text>Chargement…</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <OfferCountdown
          createdAt={job.createdAt}
          onComplete={() => setAssigned(true)}
        />

        {!windowOpen && (
          <Text style={styles.error}>La fenêtre de 10 minutes est expirée.</Text>
        )}

        <Text style={styles.title}>{job.title}</Text>

        <View style={styles.hints}>
          <Text style={styles.hint}>Min {hints.min} MAD</Text>
          <Text style={[styles.hint, styles.hintRec]}>Reco {hints.recommended} MAD</Text>
          <Text style={styles.hint}>Max {hints.max} MAD</Text>
        </View>

        <Text style={styles.label}>Prix : {Math.round(price)} MAD</Text>
        <Slider
          minimumValue={hints.min}
          maximumValue={hints.max}
          step={10}
          value={price}
          onValueChange={setPrice}
          minimumTrackTintColor="#15803d"
          disabled={!windowOpen}
        />

        <Text style={styles.label}>Arrivée : {Math.round(etaMinutes)} min</Text>
        <Slider
          minimumValue={15}
          maximumValue={120}
          step={5}
          value={etaMinutes}
          onValueChange={setEtaMinutes}
          minimumTrackTintColor="#15803d"
          disabled={!windowOpen}
        />

        <TextInput
          label="Message au client"
          value={message}
          onChangeText={setMessage}
          mode="outlined"
          multiline
          style={styles.input}
        />

        {error && <Text style={styles.error}>{error}</Text>}

        <Button
          mode="contained"
          onPress={() => mut.mutate()}
          loading={mut.isPending}
          disabled={!windowOpen || mut.isPending}
        >
          Envoyer l&apos;offre
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: "#f8fafc" },
  container: { padding: 20, paddingBottom: 40 },
  center: { flex: 1, justifyContent: "center", padding: 24, alignItems: "center" },
  title: { fontSize: 20, fontWeight: "800", color: "#14532d", marginTop: 16 },
  hints: { flexDirection: "row", justifyContent: "space-between", marginTop: 12 },
  hint: { fontSize: 12, color: "#64748b", fontWeight: "600" },
  hintRec: { color: "#15803d" },
  label: { fontWeight: "600", color: "#334155", marginTop: 16 },
  input: { marginVertical: 12, backgroundColor: "#fff" },
  error: { color: "#dc2626", marginVertical: 8 },
  assignedTitle: { fontSize: 20, fontWeight: "800", color: "#14532d" },
  assignedSub: { textAlign: "center", color: "#64748b", marginVertical: 16 },
});
