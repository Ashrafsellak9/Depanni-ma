import {
  JobCreateWizardSchema,
  JobWizardSchemas,
  type JobCreateWizardInput,
} from "@depanni/validators";
import { useRouter } from "expo-router";
import { useMemo, useState, type ReactElement } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { Button } from "react-native-paper";
import { ZodError } from "zod";

import { CategoryPicker } from "@/src/components/request/CategoryPicker";
import { LocationPicker } from "@/src/components/request/LocationPicker";
import { ProblemDescription } from "@/src/components/request/ProblemDescription";
import { RecapSubmit } from "@/src/components/request/RecapSubmit";
import { StepProgress } from "@/src/components/request/StepProgress";
import { SubcategoryPicker } from "@/src/components/request/SubcategoryPicker";
import { UrgencyBudget } from "@/src/components/request/UrgencyBudget";
import {
  SERVICE_CATEGORIES,
  SUBCATEGORIES_BY_SLUG,
  type ServiceCategoryItem,
} from "@/src/lib/categories";
import { getApiErrorMessage } from "@/src/lib/api";
import { createJob, type WizardPhoto } from "@/src/services/jobs";

const CASABLANCA = { lat: 33.5731, lng: -7.5898 };

const DEFAULT: Partial<JobCreateWizardInput> = {
  urgency: "NOW",
  city: "Casablanca",
  budgetMin: 150,
  budgetMax: 500,
  lat: CASABLANCA.lat,
  lng: CASABLANCA.lng,
  address: "",
};

export function RequestWizard(): ReactElement {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [values, setValues] = useState<Partial<JobCreateWizardInput>>(DEFAULT);
  const [photos, setPhotos] = useState<WizardPhoto[]>([]);
  const [category, setCategory] = useState<ServiceCategoryItem | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const subcategories = useMemo(() => {
    const slug = category?.slug ?? SERVICE_CATEGORIES.find((c) => c.id === values.categoryId)?.slug;
    return slug ? SUBCATEGORIES_BY_SLUG[slug] ?? [] : [];
  }, [category, values.categoryId]);

  const patch = (p: Partial<JobCreateWizardInput>) => setValues((v) => ({ ...v, ...p }));

  const validateStep = (s: number): boolean => {
    try {
      if (s === 1) JobWizardSchemas.step1.parse({ categoryId: values.categoryId });
      if (s === 2) JobWizardSchemas.step2.parse({ subcategory: values.subcategory, title: values.title });
      if (s === 3) JobWizardSchemas.step3.parse({ description: values.description });
      if (s === 4)
        JobWizardSchemas.step4.parse({
          lat: values.lat,
          lng: values.lng,
          address: values.address,
          city: values.city,
        });
      if (s === 5)
        JobWizardSchemas.step5.parse({
          urgency: values.urgency,
          budgetMin: values.budgetMin,
          budgetMax: values.budgetMax,
          scheduledAt: values.scheduledAt,
        });
      setErrors({});
      return true;
    } catch (err) {
      const next: Record<string, string> = {};
      if (err instanceof ZodError) {
        err.errors.forEach((e) => {
          const key = String(e.path[0] ?? "form");
          next[key] = e.message;
        });
      }
      setErrors(next);
      return false;
    }
  };

  const next = () => {
    if (!validateStep(step)) return;
    setStep((s) => Math.min(s + 1, 6));
  };

  const back = () => setStep((s) => Math.max(s - 1, 1));

  const submit = async () => {
    if (!validateStep(5)) {
      setStep(5);
      return;
    }
    const parsed = JobCreateWizardSchema.safeParse(values);
    if (!parsed.success) {
      Alert.alert("Formulaire", "Vérifiez les champs");
      return;
    }
    setSubmitting(true);
    try {
      const job = await createJob(parsed.data, photos);
      router.replace(`/mission/${job.id}?searching=1`);
    } catch (err) {
      Alert.alert("Erreur", getApiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <StepProgress step={step} />

      {step === 1 && (
        <CategoryPicker
          value={values.categoryId}
          error={errors.categoryId}
          onSelect={(cat) => {
            setCategory(cat);
            patch({ categoryId: cat.id, subcategory: "", title: "" });
          }}
        />
      )}

      {step === 2 && (
        <SubcategoryPicker
          items={subcategories}
          value={values.subcategory}
          error={errors.subcategory ?? errors.title}
          onSelect={(sub) => {
            patch({
              subcategory: sub.id,
              title: `${sub.label} — ${category?.nameFr ?? "Intervention"}`,
            });
          }}
        />
      )}

      {step === 3 && (
        <ProblemDescription
          description={values.description ?? ""}
          photos={photos}
          onDescriptionChange={(d) => patch({ description: d })}
          onPhotosChange={setPhotos}
          error={errors.description}
        />
      )}

      {step === 4 && (
        <LocationPicker
          lat={values.lat ?? CASABLANCA.lat}
          lng={values.lng ?? CASABLANCA.lng}
          address={values.address ?? ""}
          city={values.city ?? "Casablanca"}
          error={errors.address ?? errors.lat}
          onChange={(p) => patch(p)}
        />
      )}

      {step === 5 && (
        <UrgencyBudget
          urgency={values.urgency ?? "NOW"}
          budgetMin={values.budgetMin ?? 150}
          budgetMax={values.budgetMax ?? 500}
          error={errors.budgetMax ?? errors.urgency}
          onUrgencyChange={(u) => patch({ urgency: u })}
          onBudgetChange={(min, max) => patch({ budgetMin: min, budgetMax: max })}
        />
      )}

      {step === 6 && (
        <RecapSubmit
          category={category}
          subcategoryId={values.subcategory}
          title={values.title}
          description={values.description}
          address={values.address}
          city={values.city}
          urgency={values.urgency ?? "NOW"}
          budgetMin={values.budgetMin}
          budgetMax={values.budgetMax}
          photoCount={photos.length}
          submitting={submitting}
          onSubmit={submit}
        />
      )}

      {step < 6 && (
        <View style={styles.nav}>
          {step > 1 && (
            <Button mode="outlined" onPress={back} style={styles.navBtn}>
              Retour
            </Button>
          )}
          <Button mode="contained" onPress={next} style={styles.navBtn}>
            Suivant
          </Button>
        </View>
      )}
      {step === 6 && step > 1 && (
        <Button mode="outlined" onPress={back} style={styles.backRecap}>
          Retour
        </Button>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f8fafc" },
  nav: { flexDirection: "row", gap: 10, marginTop: 16 },
  navBtn: { flex: 1 },
  backRecap: { marginTop: 8 },
});
