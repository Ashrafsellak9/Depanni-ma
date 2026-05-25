import { StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-paper";

import { SUBCATEGORIES_BY_SLUG, type ServiceCategoryItem } from "@/src/lib/categories";
import type { JobUrgency } from "@/src/types/job";

interface RecapSubmitProps {
  category: ServiceCategoryItem | null;
  subcategoryId?: string;
  title?: string;
  description?: string;
  address?: string;
  city?: string;
  urgency: JobUrgency;
  budgetMin?: number;
  budgetMax?: number;
  photoCount: number;
  submitting: boolean;
  onSubmit: () => void;
}

export function RecapSubmit({
  category,
  subcategoryId,
  title,
  description,
  address,
  city,
  urgency,
  budgetMin,
  budgetMax,
  photoCount,
  submitting,
  onSubmit,
}: RecapSubmitProps) {
  const subLabel =
    category &&
    SUBCATEGORIES_BY_SLUG[category.slug]?.find((s) => s.id === subcategoryId)?.label;

  return (
    <View style={styles.flex}>
      <Text style={styles.title}>Récapitulatif</Text>
      <View style={styles.card}>
        <Row label="Service" value={category?.nameFr ?? "—"} />
        <Row label="Type" value={subLabel ?? subcategoryId ?? "—"} />
        <Row label="Titre" value={title ?? "—"} />
        <Row label="Description" value={(description ?? "").slice(0, 120) + "…"} />
        <Row label="Lieu" value={`${address ?? ""}, ${city ?? ""}`} />
        <Row label="Urgence" value={urgency} />
        <Row label="Budget" value={`${budgetMin ?? "—"} – ${budgetMax ?? "—"} MAD`} />
        <Row label="Photos" value={String(photoCount)} />
      </View>
      <Button
        mode="contained"
        onPress={onSubmit}
        loading={submitting}
        disabled={submitting}
        style={styles.btn}
        contentStyle={styles.btnContent}
      >
        {submitting ? "Lancement…" : "Trouver un artisan"}
      </Button>
    </View>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  title: { fontSize: 18, fontWeight: "700", color: "#14532d", marginBottom: 12 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginBottom: 20,
  },
  row: { marginBottom: 10 },
  rowLabel: { fontSize: 12, color: "#64748b", fontWeight: "600" },
  rowValue: { fontSize: 15, color: "#0f172a", marginTop: 2 },
  btn: { borderRadius: 10 },
  btnContent: { paddingVertical: 6 },
});
