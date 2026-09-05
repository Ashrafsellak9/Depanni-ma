"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Mail, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { AuthErrorBanner } from "@/components/auth/AuthErrorBanner";
import {
  AuthField,
  authFieldDescribedBy,
  RequiredLegend,
} from "@/components/auth/AuthFormField";
import { AuthTextInput } from "@/components/auth/AuthTextInput";
import {
  formatMoroccanPhone,
  isValidLocalPhone,
} from "@/components/auth/artisanRegisterConstants";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { PhoneInput } from "@/components/auth/PhoneInput";
import { savePendingAuth } from "@/components/forms/VerifyOtpForm";
import { api, getApiErrorMessage } from "@/lib/api";
import { unwrapApi } from "@/lib/api-types";
import { passwordSchema } from "@/lib/validation";
import { DisplayTitle } from "@/components/ui/display-title";

const schema = z
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
    acceptTerms: z.boolean().refine((v) => v === true, {
      message: "Vous devez accepter les conditions pour continuer",
    }),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof schema>;

function mapRegisterError(message: string): React.ReactNode {
  const lower = message.toLowerCase();
  if (lower.includes("déjà") || lower.includes("deja") || lower.includes("conflict")) {
    return (
      <>
        Cette adresse email est déjà associée à un compte.{" "}
        <Link href="/login" className="font-semibold underline hover:text-dep-red/80">
          Se connecter ?
        </Link>
      </>
    );
  }
  return message;
}

export function CitizenRegisterForm() {
  const router = useRouter();
  const [globalError, setGlobalError] = useState<React.ReactNode>("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [verifyPhone, setVerifyPhone] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    clearErrors,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: { acceptTerms: false },
  });

  const password = watch("password");
  const confirmPassword = watch("confirmPassword");
  const acceptTerms = watch("acceptTerms");

  useEffect(() => {
    document.getElementById("firstName")?.focus();
  }, []);

  useEffect(() => {
    if (confirmPassword) {
      if (password !== confirmPassword) {
        // trigger revalidation via setValue
        setValue("confirmPassword", confirmPassword, { shouldValidate: true });
      } else {
        clearErrors("confirmPassword");
      }
    }
  }, [password, confirmPassword, setValue, clearErrors]);

  const clearField = (field: keyof FormValues) => {
    clearErrors(field);
    setGlobalError("");
  };

  const onSubmit = async (values: FormValues) => {
    setGlobalError("");
    try {
      const res = await api.post("/auth/register", {
        email: values.email,
        phone: formatMoroccanPhone(values.phoneLocal),
        password: values.password,
        firstName: values.firstName,
        lastName: values.lastName,
        locale: "fr",
      });
      const data = unwrapApi<{ phone: string; message: string; devOtp?: string }>(res);
      savePendingAuth(values.email, values.password);
      if (data.devOtp) {
        sessionStorage.setItem("depanni:dev-otp", data.devOtp);
      } else {
        sessionStorage.removeItem("depanni:dev-otp");
      }
      setVerifyPhone(data.phone);
      setIsSuccess(true);
    } catch (err) {
      setGlobalError(mapRegisterError(getApiErrorMessage(err)));
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
          Bienvenue sur DEPANNI.ma. Vérifiez votre numéro par SMS pour activer votre compte et
          accéder à votre espace citoyen.
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

  const { ref: firstNameRef, ...firstNameReg } = register("firstName", {
    onChange: () => clearField("firstName"),
  });
  const { ref: lastNameRef, ...lastNameReg } = register("lastName", {
    onChange: () => clearField("lastName"),
  });
  const { ref: emailRef, ...emailReg } = register("email", {
    onChange: () => clearField("email"),
  });
  const { ref: phoneRef, ...phoneReg } = register("phoneLocal", {
    onChange: () => clearField("phoneLocal"),
  });
  const { ref: passwordRef, ...passwordReg } = register("password", {
    onChange: () => clearField("password"),
  });
  const { ref: confirmRef, ...confirmReg } = register("confirmPassword", {
    onChange: () => clearField("confirmPassword"),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      {globalError && <AuthErrorBanner>{globalError}</AuthErrorBanner>}

      <div className="grid gap-6 min-[400px]:grid-cols-2">
        <AuthField
          id="firstName"
          label="Prénom"
          required
          error={errors.firstName?.message}
        >
          <AuthTextInput
            id="firstName"
            icon={User}
            placeholder="Votre prénom"
            autoComplete="given-name"
            autoFocus
            hasError={!!errors.firstName}
            aria-describedby={authFieldDescribedBy("firstName", errors.firstName?.message)}
            {...firstNameReg}
            ref={firstNameRef}
          />
        </AuthField>

        <AuthField id="lastName" label="Nom" required error={errors.lastName?.message}>
          <AuthTextInput
            id="lastName"
            icon={User}
            placeholder="Votre nom"
            autoComplete="family-name"
            hasError={!!errors.lastName}
            aria-describedby={authFieldDescribedBy("lastName", errors.lastName?.message)}
            {...lastNameReg}
            ref={lastNameRef}
          />
        </AuthField>
      </div>

      <AuthField id="email" label="Email" required error={errors.email?.message}>
        <AuthTextInput
          id="email"
          icon={Mail}
          type="email"
          inputMode="email"
          placeholder="exemple@email.ma"
          autoComplete="email"
          hasError={!!errors.email}
          aria-describedby={authFieldDescribedBy("email", errors.email?.message)}
          {...emailReg}
          ref={emailRef}
        />
      </AuthField>

      <AuthField
        id="phoneLocal"
        label="Téléphone"
        required
        error={errors.phoneLocal?.message}
        hint="Utilisé uniquement pour que les artisans puissent vous contacter."
      >
        <PhoneInput
          id="phoneLocal"
          hasError={!!errors.phoneLocal}
          aria-describedby={authFieldDescribedBy(
            "phoneLocal",
            errors.phoneLocal?.message,
            "Utilisé uniquement pour que les artisans puissent vous contacter.",
          )}
          {...phoneReg}
          ref={phoneRef}
        />
      </AuthField>

      <AuthField id="password" label="Mot de passe" required error={errors.password?.message}>
        <PasswordInput
          id="password"
          hasError={!!errors.password}
          showStrength
          strengthValue={password}
          ruleHint
          aria-describedby={authFieldDescribedBy("password", errors.password?.message)}
          {...passwordReg}
          ref={passwordRef}
        />
      </AuthField>

      <AuthField
        id="confirmPassword"
        label="Confirmer le mot de passe"
        required
        error={errors.confirmPassword?.message}
      >
        <PasswordInput
          id="confirmPassword"
          placeholder="Confirmez votre mot de passe"
          hasError={!!errors.confirmPassword}
          aria-describedby={authFieldDescribedBy(
            "confirmPassword",
            errors.confirmPassword?.message,
          )}
          {...confirmReg}
          ref={confirmRef}
        />
      </AuthField>

      <label className="flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          className="mt-1 h-4 w-4 rounded border-dep-border text-orange focus:ring-orange"
          {...register("acceptTerms", {
            onChange: () => {
              clearErrors("acceptTerms");
              setGlobalError("");
            },
          })}
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
      {errors.acceptTerms && (
        <p role="alert" className="text-sm text-dep-red">
          {errors.acceptTerms.message}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting || !acceptTerms}
        className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-orange text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:brightness-[0.92] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
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
          "Créer mon compte citoyen"
        )}
      </button>

      <p className="text-center text-sm text-dep-gray">
        <Link href="/register" className="font-medium text-orange hover:underline">
          Changer de type de compte
        </Link>
        {" · "}
        <Link href="/login" className="font-medium text-orange hover:underline">
          Se connecter
        </Link>
      </p>
    </form>
  );
}
