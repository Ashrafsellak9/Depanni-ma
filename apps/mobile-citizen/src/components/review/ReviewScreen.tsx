import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Button, TextInput } from "react-native-paper";
import StarRating from "react-native-star-rating-widget";
import { useMutation } from "@tanstack/react-query";

import { getApiErrorMessage } from "@/src/lib/api";
import { submitReview } from "@/src/services/jobs";
import type { ReviewCriteria } from "@/src/types/mission";

const CRITERIA_LABELS: { key: keyof ReviewCriteria; label: string }[] = [
  { key: "punctuality", label: "Ponctualité" },
  { key: "quality", label: "Qualité du travail" },
  { key: "cleanliness", label: "Propreté" },
  { key: "communication", label: "Communication" },
  { key: "price", label: "Rapport qualité / prix" },
];

interface ReviewScreenProps {
  missionId: string;
  jobId: string;
}

export function ReviewScreen({ missionId, jobId }: ReviewScreenProps) {
  const router = useRouter();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [criteria, setCriteria] = useState<ReviewCriteria>({
    punctuality: 5,
    quality: 5,
    cleanliness: 5,
    communication: 5,
    price: 5,
  });
  const [error, setError] = useState<string | null>(null);

  const needsComment = rating < 3;

  const mut = useMutation({
    mutationFn: () =>
      submitReview({
        missionId,
        rating,
        comment: needsComment ? comment.trim() : comment.trim() || undefined,
        criteria,
      }),
    onSuccess: () => {
      router.replace({ pathname: "/(tabs)/missions" } as never);
    },
    onError: (e) => setError(getApiErrorMessage(e)),
  });

  const submit = () => {
    if (needsComment && comment.trim().length < 10) {
      setError("Commentaire obligatoire (min. 10 caractères) pour une note inférieure à 3");
      return;
    }
    setError(null);
    mut.mutate();
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>Noter l&apos;artisan</Text>
      <Text style={styles.sub}>Votre avis déclenche le paiement final</Text>

      <View style={styles.stars}>
        <StarRating rating={rating} onChange={setRating} starSize={40} color="#facc15" />
      </View>

      {CRITERIA_LABELS.map(({ key, label }) => (
        <View key={key} style={styles.criterion}>
          <Text style={styles.criterionLabel}>{label}</Text>
          <StarRating
            rating={criteria[key]}
            onChange={(v) => setCriteria((c) => ({ ...c, [key]: v }))}
            starSize={28}
            color="#facc15"
          />
        </View>
      ))}

      <TextInput
        label={needsComment ? "Commentaire (obligatoire)" : "Commentaire (optionnel)"}
        value={comment}
        onChangeText={setComment}
        mode="outlined"
        multiline
        numberOfLines={4}
        style={styles.comment}
      />

      {error && <Text style={styles.error}>{error}</Text>}

      <Button
        mode="contained"
        onPress={submit}
        loading={mut.isPending}
        disabled={mut.isPending}
        buttonColor="#15803d"
        style={styles.btn}
      >
        Envoyer l&apos;avis
      </Button>

      <Button mode="text" onPress={() => router.replace({ pathname: "/mission/[id]", params: { id: jobId } } as never)}>
        Retour à la mission
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 48 },
  title: { fontSize: 24, fontWeight: "800", color: "#14532d" },
  sub: { marginTop: 6, color: "#64748b", fontSize: 15 },
  stars: { alignItems: "center", marginVertical: 24 },
  criterion: { marginBottom: 16 },
  criterionLabel: { fontSize: 15, fontWeight: "600", color: "#334155", marginBottom: 6 },
  comment: { marginTop: 8, backgroundColor: "#fff" },
  error: { color: "#dc2626", marginTop: 12 },
  btn: { marginTop: 20 },
});
