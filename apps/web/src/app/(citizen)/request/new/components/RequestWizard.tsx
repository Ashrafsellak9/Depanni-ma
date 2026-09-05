"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { ZodError } from "zod";
import { ChevronLeft, ChevronRight, Mic, MicOff } from "lucide-react";
import {
  JobCreateWizardSchema,
  JobWizardSchemas,
  type JobCreateWizardInput,
} from "@depanni/validators";

import { CategoryGrid } from "@/app/(citizen)/request/new/components/CategoryGrid";
import { LocationPicker } from "@/components/maps";
import { PhotoUpload, type PhotoFile } from "@/app/(citizen)/request/new/components/PhotoUpload";
import { UrgencySelector } from "@/app/(citizen)/request/new/components/UrgencySelector";
import { Button } from "@/components/ui/button";
import { DisplayTitle } from "@/components/ui/display-title";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api, getApiErrorMessage } from "@/lib/api";
import { unwrapApi } from "@/lib/api-types";
import {
  clearRequestDraft,
  loadRequestDraft,
  saveRequestDraft,
} from "@/lib/request-draft";
import { SUBCATEGORIES_BY_SLUG } from "@/lib/request-subcategories";
import { SERVICE_CATEGORIES, type ServiceCategoryItem } from "@/lib/service-categories";
import { cn } from "@/lib/utils";

const STEPS = [
  "Catégorie",
  "Type",
  "Description",
  "Localisation",
  "Urgence & budget",
  "Confirmation",
] as const;

const DEFAULT_VALUES: Partial<JobCreateWizardInput> = {
  urgency: "NOW",
  city: "Casablanca",
  budgetMin: 150,
  budgetMax: 500,
};

export function RequestWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [photos, setPhotos] = useState<PhotoFile[]>([]);
  const [listening, setListening] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategoryItem | null>(null);

  const form = useForm<Partial<JobCreateWizardInput>>({
    defaultValues: DEFAULT_VALUES,
    mode: "onChange",
  });

  const { watch, setValue, getValues, reset, formState } = form;
  const values = watch();

  const subcategories = useMemo(() => {
    const slug = selectedCategory?.slug ?? SERVICE_CATEGORIES.find((c) => c.id === values.categoryId)?.slug;
    return slug ? SUBCATEGORIES_BY_SLUG[slug] ?? [] : [];
  }, [selectedCategory, values.categoryId]);

  useEffect(() => {
    const draft = loadRequestDraft();
    if (draft) {
      reset({ ...DEFAULT_VALUES, ...draft.values });
      setStep(draft.step);
      const cat = SERVICE_CATEGORIES.find((c) => c.id === draft.values.categoryId);
      if (cat) setSelectedCategory(cat);
      toast("Brouillon restauré", { icon: "📝" });
    }
    const urgency = searchParams.get("urgency");
    if (urgency === "NOW") setValue("urgency", "NOW");
  }, [reset, searchParams, setValue]);

  useEffect(() => {
    saveRequestDraft(step, getValues());
  }, [step, values, getValues]);

  const validateStep = async (s: number): Promise<boolean> => {
    const v = getValues();
    try {
      if (s === 1) JobWizardSchemas.step1.parse({ categoryId: v.categoryId });
      if (s === 2) JobWizardSchemas.step2.parse({ subcategory: v.subcategory, title: v.title });
      if (s === 3) JobWizardSchemas.step3.parse({ description: v.description });
      if (s === 4) JobWizardSchemas.step4.parse({ lat: v.lat, lng: v.lng, address: v.address, city: v.city });
      if (s === 5) {
        JobWizardSchemas.step5.parse({
          urgency: v.urgency,
          budgetMin: v.budgetMin,
          budgetMax: v.budgetMax,
          scheduledAt: v.scheduledAt,
        });
      }
      return true;
    } catch (err) {
      if (err instanceof ZodError) {
        err.errors.forEach((e) => {
          const field = e.path[0] as keyof JobCreateWizardInput;
          if (field) form.setError(field, { message: e.message });
        });
      }
      return false;
    }
  };

  const next = async () => {
    const ok = await validateStep(step);
    if (!ok) return;
    setStep((s) => Math.min(s + 1, STEPS.length));
  };

  const back = () => setStep((s) => Math.max(s - 1, 1));

  const onCategorySelect = (cat: ServiceCategoryItem) => {
    setSelectedCategory(cat);
    setValue("categoryId", cat.id, { shouldValidate: true });
    setValue("subcategory", "");
    setValue("title", "");
  };

  const onSubcategorySelect = (sub: { id: string; label: string }) => {
    setValue("subcategory", sub.id, { shouldValidate: true });
    const catName = selectedCategory?.nameFr ?? "Intervention";
    setValue("title", `${sub.label} — ${catName}`, { shouldValidate: true });
  };

  const toggleSpeech = useCallback(() => {
    type SpeechRecognitionCtor = new () => {
      lang: string;
      continuous: boolean;
      interimResults: boolean;
      start: () => void;
      stop: () => void;
      onresult: ((event: { resultIndex: number; results: { [i: number]: { [j: number]: { transcript: string } } } }) => void) | null;
      onend: (() => void) | null;
      onerror: (() => void) | null;
    };
    const win = window as unknown as {
      SpeechRecognition?: SpeechRecognitionCtor;
      webkitSpeechRecognition?: SpeechRecognitionCtor;
    };
    const SR = win.SpeechRecognition ?? win.webkitSpeechRecognition;
    if (!SR) {
      toast.error("Reconnaissance vocale non supportée sur ce navigateur");
      return;
    }
    if (listening) {
      setListening(false);
      return;
    }
    const recognition = new SR();
    recognition.lang = "fr-MA";
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.onresult = (event) => {
      let transcript = "";
      const list = event.results as unknown as Array<Array<{ transcript: string }>>;
      for (let i = event.resultIndex; i < list.length; i++) {
        const chunk = list[i]?.[0]?.transcript;
        if (chunk) transcript += chunk;
      }
      const current = getValues("description") ?? "";
      setValue("description", `${current} ${transcript}`.trim(), { shouldValidate: true });
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    recognition.start();
    setListening(true);
  }, [getValues, listening, setValue]);

  const submit = async () => {
    const ok = await validateStep(5);
    if (!ok) {
      setStep(5);
      return;
    }
    const data = getValues();
    const parsed = JobCreateWizardSchema.safeParse(data);
    if (!parsed.success) {
      toast.error("Vérifiez les champs du formulaire");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("categoryId", parsed.data.categoryId);
      formData.append("subcategory", parsed.data.subcategory);
      formData.append("title", parsed.data.title);
      formData.append("description", parsed.data.description);
      formData.append("urgency", parsed.data.urgency);
      formData.append("lat", String(parsed.data.lat));
      formData.append("lng", String(parsed.data.lng));
      formData.append("address", parsed.data.address);
      formData.append("city", parsed.data.city);
      if (parsed.data.budgetMin != null) formData.append("budgetMin", String(parsed.data.budgetMin));
      if (parsed.data.budgetMax != null) formData.append("budgetMax", String(parsed.data.budgetMax));
      if (parsed.data.scheduledAt) formData.append("scheduledAt", parsed.data.scheduledAt);
      photos.forEach((p) => formData.append("photos", p.file));

      const res = await api.post("/jobs", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const job = unwrapApi<{ id: string }>(res);
      clearRequestDraft();
      toast.success("Recherche d'artisans lancée");
      router.push(`/missions/${job.id}?searching=1`);
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const categoryLabel =
    SERVICE_CATEGORIES.find((c) => c.id === values.categoryId)?.nameFr ?? "—";
  const subLabel =
    subcategories.find((s) => s.id === values.subcategory)?.label ?? values.subcategory;

  return (
    <div className="space-y-6">
      <div className="flex gap-1">
        {STEPS.map((label, i) => {
          const n = i + 1;
          return (
            <div key={label} className="flex-1">
              <div
                className={cn(
                  "h-1.5 rounded-full transition-colors",
                  n <= step ? "bg-primary" : "bg-muted",
                )}
              />
              <p
                className={cn(
                  "mt-1 hidden text-[10px] sm:block",
                  n === step ? "font-medium text-primary" : "text-muted-foreground",
                )}
              >
                {label}
              </p>
            </div>
          );
        })}
      </div>

      {step === 1 && (
        <div>
          <DisplayTitle as="h2" size="sm" className="mb-4 text-lg font-semibold">
            Quel service&nbsp;?
          </DisplayTitle>
          <CategoryGrid
            value={values.categoryId}
            onSelect={onCategorySelect}
            error={formState.errors.categoryId?.message}
          />
        </div>
      )}

      {step === 2 && (
        <div>
          <DisplayTitle as="h2" size="sm" className="mb-4 text-lg font-semibold">
            Précisez le besoin
          </DisplayTitle>
          <div className="grid gap-2 sm:grid-cols-2">
            {subcategories.map((sub) => (
              <button
                key={sub.id}
                type="button"
                onClick={() => onSubcategorySelect(sub)}
                className={cn(
                  "rounded-lg border px-4 py-3 text-left text-sm font-medium transition-colors",
                  values.subcategory === sub.id
                    ? "border-primary bg-primary/10 text-primary"
                    : "hover:bg-muted",
                )}
              >
                {sub.label}
              </button>
            ))}
          </div>
          {formState.errors.subcategory && (
            <p className="mt-2 text-sm text-danger">{formState.errors.subcategory.message}</p>
          )}
          <div className="mt-4 space-y-2">
            <Label htmlFor="title">Titre de la demande</Label>
            <Input id="title" {...form.register("title")} />
            {formState.errors.title && (
              <p className="text-sm text-danger">{formState.errors.title.message}</p>
            )}
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <DisplayTitle as="h2" size="sm" className="mb-4 text-lg font-semibold">
            Décrivez le problème
          </DisplayTitle>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="description">Description</Label>
              <Button type="button" variant="outline" size="sm" onClick={toggleSpeech}>
                {listening ? (
                  <>
                    <MicOff className="mr-1 h-4 w-4" /> Arrêter
                  </>
                ) : (
                  <>
                    <Mic className="mr-1 h-4 w-4" /> Dictée vocale
                  </>
                )}
              </Button>
            </div>
            <textarea
              id="description"
              rows={5}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              {...form.register("description")}
            />
            {formState.errors.description && (
              <p className="text-sm text-danger">{formState.errors.description.message}</p>
            )}
          </div>
          <div className="mt-6">
            <Label className="mb-2 block">Photos (optionnel)</Label>
            <PhotoUpload value={photos} onChange={setPhotos} />
          </div>
        </div>
      )}

      {step === 4 && (
        <div>
          <DisplayTitle as="h2" size="sm" className="mb-4 text-lg font-semibold">
            Où intervenir&nbsp;?
          </DisplayTitle>
          <LocationPicker
            lat={values.lat}
            lng={values.lng}
            address={values.address ?? ""}
            city={values.city ?? "Casablanca"}
            onChange={(patch) => {
              if (patch.lat != null) setValue("lat", patch.lat, { shouldValidate: true });
              if (patch.lng != null) setValue("lng", patch.lng, { shouldValidate: true });
              if (patch.address != null) setValue("address", patch.address, { shouldValidate: true });
              if (patch.city != null) setValue("city", patch.city, { shouldValidate: true });
            }}
            errors={{
              address: formState.errors.address?.message,
              city: formState.errors.city?.message,
            }}
          />
        </div>
      )}

      {step === 5 && (
        <div>
          <DisplayTitle as="h2" size="sm" className="mb-4 text-lg font-semibold">
            Urgence & budget
          </DisplayTitle>
          <UrgencySelector
            urgency={values.urgency ?? "NOW"}
            scheduledAt={values.scheduledAt}
            budgetMin={values.budgetMin ?? 150}
            budgetMax={values.budgetMax ?? 500}
            onUrgencyChange={(u) => setValue("urgency", u, { shouldValidate: true })}
            onScheduledAtChange={(iso) => setValue("scheduledAt", iso, { shouldValidate: true })}
            onBudgetChange={(min, max) => {
              if (min != null) setValue("budgetMin", min);
              if (max != null) setValue("budgetMax", max);
            }}
            errors={{
              scheduledAt: formState.errors.scheduledAt?.message,
              budgetMax: formState.errors.budgetMax?.message,
            }}
          />
        </div>
      )}

      {step === 6 && (
        <div className="space-y-4">
          <DisplayTitle as="h2" size="sm" className="text-lg font-semibold">
            Récapitulatif
          </DisplayTitle>
          <dl className="space-y-3 rounded-xl border bg-card p-4 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Service</dt>
              <dd className="font-medium text-navy text-right">{categoryLabel}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Type</dt>
              <dd className="font-medium text-navy text-right">{subLabel}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Titre</dt>
              <dd className="font-medium text-navy text-right">{values.title}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Description</dt>
              <dd className="mt-1 text-navy">{values.description}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Adresse</dt>
              <dd className="font-medium text-navy text-right">
                {values.address}, {values.city}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Urgence</dt>
              <dd className="font-medium text-navy">
                {values.urgency === "NOW"
                  ? "Maintenant"
                  : values.urgency === "IN2H"
                    ? "Dans 2 h"
                    : "Planifié"}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Budget</dt>
              <dd className="font-medium text-primary">
                {values.budgetMin} – {values.budgetMax} MAD
              </dd>
            </div>
            {photos.length > 0 && (
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Photos</dt>
                <dd className="font-medium text-navy">{photos.length} fichier(s)</dd>
              </div>
            )}
          </dl>
        </div>
      )}

      <div className="flex justify-between gap-3 pt-2">
        <Button type="button" variant="outline" onClick={back} disabled={step === 1 || submitting}>
          <ChevronLeft className="mr-1 h-4 w-4" />
          Précédent
        </Button>
        {step < STEPS.length ? (
          <Button type="button" onClick={() => void next()}>
            Suivant
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        ) : (
          <Button type="button" onClick={() => void submit()} disabled={submitting}>
            {submitting ? "Publication…" : "Trouver des artisans"}
          </Button>
        )}
      </div>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="w-full text-muted-foreground"
        onClick={() => {
          clearRequestDraft();
          reset(DEFAULT_VALUES);
          setPhotos([]);
          setStep(1);
          toast("Brouillon effacé");
        }}
      >
        Effacer le brouillon
      </Button>
    </div>
  );
}
