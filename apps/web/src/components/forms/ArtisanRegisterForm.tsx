"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  CheckCircle2,
  Mail,
  User,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  AuthField,
  authFieldDescribedBy,
  authInputClass,
  RequiredLegend,
  RequiredMark,
} from "@/components/auth/AuthFormField";
import {
  ARTISAN_SERVICES,
  formatMoroccanPhone,
  isValidLocalPhone,
  WIZARD_STEPS,
} from "@/components/auth/artisanRegisterConstants";
import { AuthErrorBanner } from "@/components/auth/AuthErrorBanner";
import { AuthTextInput } from "@/components/auth/AuthTextInput";
import { FileDropzone } from "@/components/auth/FileDropzone";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { PhoneInput } from "@/components/auth/PhoneInput";
import { savePendingAuth } from "@/components/forms/VerifyOtpForm";
import { api, getApiErrorMessage } from "@/lib/api";
import { unwrapApi } from "@/lib/api-types";
import { passwordSchema } from "@/lib/validation";
import { cn } from "@/lib/utils";
import { DisplayTitle } from "@/components/ui/display-title";

const step1Schema = z
  .object({
    firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
    lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
    email: z
      .string()
      .min(1, "Veuillez saisir une adresse email valide")
      .email("Veuillez saisir une adresse email valide"),
    phoneLocal: z
      .string()
      .min(1, "Le numéro de téléphone est requis")
      .refine(isValidLocalPhone, "Numéro invalide. Saisissez 6XXXXXXXX ou 7XXXXXXXX"),
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Veuillez confirmer votre mot de passe"),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

const step2Schema = z.object({
  specialties: z.array(z.string()).min(1, "Sélectionnez au moins un métier"),
  city: z.string().min(1, "La ville est requise"),
  serviceRadiusKm: z.number().min(5).max(50),
});

type Step1Values = z.infer<typeof step1Schema>;
type Step2Values = z.infer<typeof step2Schema>;

function WizardProgress({ step }: { step: number }) {
  return (
    <div className="mb-6">
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-dep-gray">
          Étape {step} sur 3
        </p>
        <p className="text-xs font-medium text-navy">{WIZARD_STEPS[step - 1]?.title}</p>
      </div>
      <div
        className="h-1 w-full overflow-hidden rounded-full bg-cream-2"
        role="progressbar"
        aria-valuenow={step}
        aria-valuemin={1}
        aria-valuemax={3}
        aria-label={`Étape ${step} sur 3 : ${WIZARD_STEPS[step - 1]?.title}`}
      >
        <div
          className="h-full rounded-full bg-orange transition-all duration-300"
          style={{ width: `${(step / 3) * 100}%` }}
        />
      </div>
      <div className="mt-3 flex gap-2">
        {WIZARD_STEPS.map((s) => (
          <span
            key={s.id}
            className={cn(
              "flex-1 rounded-md px-2 py-1 text-center text-[10px] font-semibold uppercase tracking-wide transition-colors duration-200",
              step === s.id
                ? "bg-orange/10 text-orange"
                : step > s.id
                  ? "bg-green/10 text-green"
                  : "bg-cream-2 text-dep-gray",
            )}
          >
            {s.title}
          </span>
        ))}
      </div>
    </div>
  );
}

export function ArtisanRegisterForm() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [globalError, setGlobalError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [verifyPhone, setVerifyPhone] = useState("");

  const [step1Data, setStep1Data] = useState<Step1Values | null>(null);
  const [step2Data, setStep2Data] = useState<Step2Values | null>(null);

  const [cinDocument, setCinDocument] = useState<File | null>(null);
  const [tradeLicense, setTradeLicense] = useState<File | null>(null);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [cinNumber, setCinNumber] = useState("");

  const step1Form = useForm<Step1Values>({
    resolver: zodResolver(step1Schema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: step1Data ?? {
      firstName: "",
      lastName: "",
      email: "",
      phoneLocal: "",
      password: "",
      confirmPassword: "",
    },
  });

  const step2Form = useForm<Step2Values>({
    resolver: zodResolver(step2Schema),
    defaultValues: step2Data ?? {
      specialties: [],
      city: "El Jadida",
      serviceRadiusKm: 15,
    },
  });

  const password = step1Form.watch("password");
  const specialties = step2Form.watch("specialties");
  const radius = step2Form.watch("serviceRadiusKm");
  const { ref: firstNameRef, ...firstNameRegister } = step1Form.register("firstName");

  useEffect(() => {
    if (step === 1) {
      document.getElementById("firstName")?.focus();
    } else if (step === 2) {
      document.getElementById("city")?.focus();
    } else {
      document.getElementById("cinNumber")?.focus();
    }
  }, [step]);

  const toggleSpecialty = (id: string) => {
    const current = step2Form.getValues("specialties");
    const next = current.includes(id)
      ? current.filter((s) => s !== id)
      : [...current, id];
    step2Form.setValue("specialties", next, { shouldValidate: true });
    step2Form.clearErrors("specialties");
  };

  const handleStep1Next = step1Form.handleSubmit((data) => {
    setStep1Data(data);
    setGlobalError("");
    setStep(2);
  });

  const handleStep2Next = step2Form.handleSubmit((data) => {
    setStep2Data(data);
    setGlobalError("");
    setStep(3);
  });

  const handleSubmit = async () => {
    setGlobalError("");
    if (!acceptTerms) {
      setGlobalError("Vous devez accepter les conditions pour continuer.");
      return;
    }
    if (!step1Data || !step2Data) return;

    setIsSubmitting(true);
    try {
      const form = new FormData();
      form.append("email", step1Data.email);
      form.append("phone", formatMoroccanPhone(step1Data.phoneLocal));
      form.append("password", step1Data.password);
      form.append("firstName", step1Data.firstName);
      form.append("lastName", step1Data.lastName);
      form.append("locale", "fr");
      form.append("serviceRadiusKm", String(step2Data.serviceRadiusKm));
      form.append("city", step2Data.city);
      form.append("specialties", JSON.stringify(step2Data.specialties));
      if (cinNumber.trim()) form.append("cinNumber", cinNumber.trim());
      if (cinDocument) form.append("cinDocument", cinDocument);
      if (tradeLicense) form.append("tradeLicense", tradeLicense);

      const res = await api.post("/auth/register/artisan", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const data = unwrapApi<{ phone: string; message: string; devOtp?: string }>(res);
      savePendingAuth(step1Data.email, step1Data.password);
      if (data.devOtp) {
        sessionStorage.setItem("depanni:dev-otp", data.devOtp);
      } else {
        sessionStorage.removeItem("depanni:dev-otp");
      }
      setVerifyPhone(data.phone);
      setIsSuccess(true);
    } catch (err) {
      setGlobalError(getApiErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center transition-opacity duration-300">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green/10">
          <CheckCircle2 className="h-7 w-7 text-green" aria-hidden />
        </div>
        <DisplayTitle as="h2" size="sm" className="text-xl">
          Compte créé
        </DisplayTitle>
        <p className="mt-3 text-sm leading-relaxed text-dep-gray">
          Votre profil sera vérifié sous 24 h pour obtenir le badge Artisan vérifié. Vérifiez
          maintenant votre numéro par SMS pour activer votre compte.
        </p>
        <button
          type="button"
          onClick={() =>
            router.push(`/register/verify?phone=${encodeURIComponent(verifyPhone)}`)
          }
          className="mt-6 flex min-h-[48px] w-full items-center justify-center rounded-xl bg-orange text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:brightness-[0.92] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2"
        >
          Vérifier mon numéro
        </button>
      </div>
    );
  }

  return (
    <div>
      <WizardProgress step={step} />
      <RequiredLegend />

      {globalError && <AuthErrorBanner>{globalError}</AuthErrorBanner>}

      {/* Étape 1 */}
      {step === 1 && (
        <form
          onSubmit={handleStep1Next}
          className="mt-6 space-y-6 transition-opacity duration-300"
          noValidate
        >
          <div className="grid gap-6 min-[400px]:grid-cols-2">
            <AuthField
              id="firstName"
              label="Prénom"
              required
              error={step1Form.formState.errors.firstName?.message}
            >
              <AuthTextInput
                id="firstName"
                icon={User}
                placeholder="Votre prénom"
                autoComplete="given-name"
                hasError={!!step1Form.formState.errors.firstName}
                aria-describedby={authFieldDescribedBy(
                  "firstName",
                  step1Form.formState.errors.firstName?.message,
                )}
                {...firstNameRegister}
                ref={firstNameRef}
              />
            </AuthField>

            <AuthField
              id="lastName"
              label="Nom"
              required
              error={step1Form.formState.errors.lastName?.message}
            >
              <AuthTextInput
                id="lastName"
                icon={User}
                placeholder="Votre nom"
                autoComplete="family-name"
                hasError={!!step1Form.formState.errors.lastName}
                aria-describedby={authFieldDescribedBy(
                  "lastName",
                  step1Form.formState.errors.lastName?.message,
                )}
                {...step1Form.register("lastName")}
              />
            </AuthField>
          </div>

          <AuthField
            id="email"
            label="Email"
            required
            error={step1Form.formState.errors.email?.message}
          >
            <AuthTextInput
              id="email"
              icon={Mail}
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="exemple@email.ma"
              hasError={!!step1Form.formState.errors.email}
              aria-describedby={authFieldDescribedBy(
                "email",
                step1Form.formState.errors.email?.message,
              )}
              {...step1Form.register("email")}
            />
          </AuthField>

          <AuthField
            id="phoneLocal"
            label="Téléphone"
            required
            error={step1Form.formState.errors.phoneLocal?.message}
          >
            <PhoneInput
              id="phoneLocal"
              hasError={!!step1Form.formState.errors.phoneLocal}
              aria-describedby={authFieldDescribedBy(
                "phoneLocal",
                step1Form.formState.errors.phoneLocal?.message,
              )}
              {...step1Form.register("phoneLocal")}
            />
          </AuthField>

          <AuthField
            id="password"
            label="Mot de passe"
            required
            error={step1Form.formState.errors.password?.message}
          >
            <PasswordInput
              id="password"
              hasError={!!step1Form.formState.errors.password}
              showStrength
              strengthValue={password}
              ruleHint
              aria-describedby={authFieldDescribedBy(
                "password",
                step1Form.formState.errors.password?.message,
              )}
              {...step1Form.register("password")}
            />
          </AuthField>

          <AuthField
            id="confirmPassword"
            label="Confirmer le mot de passe"
            required
            error={step1Form.formState.errors.confirmPassword?.message}
          >
            <PasswordInput
              id="confirmPassword"
              placeholder="Confirmez votre mot de passe"
              hasError={!!step1Form.formState.errors.confirmPassword}
              aria-describedby={authFieldDescribedBy(
                "confirmPassword",
                step1Form.formState.errors.confirmPassword?.message,
              )}
              {...step1Form.register("confirmPassword")}
            />
          </AuthField>

          <button
            type="submit"
            className="flex min-h-[48px] w-full items-center justify-center rounded-xl bg-orange text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:brightness-[0.92] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2"
          >
            Continuer
          </button>
        </form>
      )}

      {/* Étape 2 */}
      {step === 2 && (
        <form
          onSubmit={handleStep2Next}
          className="mt-6 space-y-6 transition-opacity duration-300"
          noValidate
        >
          <div className="space-y-3">
            <div>
              <span className="block text-sm font-semibold text-navy">
                Vos métiers<RequiredMark />
              </span>
              <p className="mt-1 text-xs text-dep-gray">Sélectionnez un ou plusieurs métiers</p>
            </div>
            <div
              className="flex flex-wrap gap-2"
              role="group"
              aria-label="Sélection des métiers"
            >
              {ARTISAN_SERVICES.map((service) => {
                const selected = specialties.includes(service.id);
                return (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => toggleSpecialty(service.id)}
                    aria-pressed={selected}
                    className={cn(
                      "min-h-[40px] rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2",
                      selected
                        ? "border-orange bg-orange text-white"
                        : "border-dep-border bg-white text-navy hover:border-orange",
                    )}
                  >
                    {service.label}
                  </button>
                );
              })}
            </div>
            {step2Form.formState.errors.specialties && (
              <p role="alert" className="text-sm text-dep-red">
                {step2Form.formState.errors.specialties.message}
              </p>
            )}
          </div>

          <AuthField id="city" label="Ville d'intervention" required>
            <select
              id="city"
              className={authInputClass(false, "px-3.5")}
              {...step2Form.register("city")}
            >
              <option value="El Jadida">El Jadida</option>
            </select>
            <p className="text-xs text-dep-gray">D&apos;autres villes arrivent bientôt</p>
          </AuthField>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label htmlFor="serviceRadiusKm" className="text-sm font-semibold text-navy">
                Rayon d&apos;intervention<RequiredMark />
              </label>
              <span className="rounded-full bg-orange/10 px-3 py-1 text-xs font-semibold text-orange">
                {radius} km
              </span>
            </div>
            <input
              id="serviceRadiusKm"
              type="range"
              min={5}
              max={50}
              step={1}
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-cream-2 accent-orange"
              {...step2Form.register("serviceRadiusKm", { valueAsNumber: true })}
            />
            <div className="flex justify-between text-xs text-dep-gray">
              <span>5 km</span>
              <span>50 km</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                if (step1Data) step1Form.reset(step1Data);
                setStep(1);
              }}
              className="flex min-h-[48px] flex-1 items-center justify-center rounded-xl border border-dep-border bg-white text-sm font-semibold text-navy transition-colors duration-200 hover:border-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2"
            >
              Retour
            </button>
            <button
              type="submit"
              className="flex min-h-[48px] flex-1 items-center justify-center rounded-xl bg-orange text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:brightness-[0.92] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2"
            >
              Continuer
            </button>
          </div>
        </form>
      )}

      {/* Étape 3 */}
      {step === 3 && (
        <div className="mt-6 space-y-6 transition-opacity duration-300">
          <div className="space-y-4 rounded-xl border border-dep-border bg-cream/50 p-4">
            <DisplayTitle as="h3" size="sm" className="text-sm font-semibold">
              Carte d&apos;identité nationale
            </DisplayTitle>
            <p className="text-xs leading-relaxed text-dep-gray">
              Optionnel à l&apos;inscription, mais requis pour obtenir le badge Artisan vérifié et
              recevoir des missions.
            </p>
            <AuthField id="cinNumber" label="Numéro CIN">
            <AuthTextInput
              id="cinNumber"
              value={cinNumber}
              onChange={(e) => setCinNumber(e.target.value)}
              placeholder="Ex. AB123456"
            />
            </AuthField>
            <FileDropzone
              id="cinDocument"
              label="Scan de la CIN"
              file={cinDocument}
              onFileChange={setCinDocument}
            />
          </div>

          <FileDropzone
            id="tradeLicense"
            label="Licence ou attestation professionnelle (optionnel)"
            hint="Augmente votre visibilité auprès des clients"
            file={tradeLicense}
            onFileChange={setTradeLicense}
          />

          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => {
                setAcceptTerms(e.target.checked);
                if (e.target.checked) setGlobalError("");
              }}
              className="mt-1 h-4 w-4 rounded border-dep-border text-orange focus:ring-orange"
            />
            <span className="text-sm leading-relaxed text-dep-gray">
              J&apos;accepte les{" "}
              <Link href="/conditions" className="font-medium text-navy hover:underline">
                Conditions d&apos;utilisation
              </Link>{" "}
              et la{" "}
              <Link href="/confidentialite" className="font-medium text-navy hover:underline">
                Politique de confidentialité
              </Link>
              <span className="text-orange"> *</span>
            </span>
          </label>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                if (step2Data) step2Form.reset(step2Data);
                setStep(2);
              }}
              className="flex min-h-[48px] flex-1 items-center justify-center rounded-xl border border-dep-border bg-white text-sm font-semibold text-navy transition-colors duration-200 hover:border-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2"
            >
              Retour
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting || !acceptTerms}
              className="flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-xl bg-orange text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:brightness-[0.92] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
            >
              {isSubmitting ? (
                <>
                  <span
                    className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
                    aria-hidden
                  />
                  Création en cours...
                </>
              ) : (
                "Créer mon compte artisan"
              )}
            </button>
          </div>
        </div>
      )}

      <p className="mt-6 text-center text-sm text-dep-gray">
        <Link href="/register" className="font-medium text-orange hover:underline">
          Changer de type de compte
        </Link>
        {" · "}
        <Link href="/login" className="font-medium text-orange hover:underline">
          Se connecter
        </Link>
      </p>
    </div>
  );
}
