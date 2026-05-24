"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

import { savePendingAuth } from "@/components/forms/VerifyOtpForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api, getApiErrorMessage } from "@/lib/api";
import { unwrapApi } from "@/lib/api-types";
import { moroccanPhoneSchema, passwordSchema } from "@/lib/validation";

const schema = z
  .object({
    email: z.string().email("Email invalide"),
    phone: moroccanPhoneSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
    firstName: z.string().min(2, "Minimum 2 caractères"),
    lastName: z.string().min(2, "Minimum 2 caractères"),
    cinNumber: z.string().optional(),
    serviceRadiusKm: z.coerce.number().min(1).max(100).default(15),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof schema>;

export function ArtisanRegisterForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { serviceRadiusKm: 15 },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const form = new FormData();
      form.append("email", values.email);
      form.append("phone", values.phone);
      form.append("password", values.password);
      form.append("firstName", values.firstName);
      form.append("lastName", values.lastName);
      form.append("locale", "fr");
      form.append("serviceRadiusKm", String(values.serviceRadiusKm));
      if (values.cinNumber) form.append("cinNumber", values.cinNumber);

      const cinInput = document.getElementById("cinDocument") as HTMLInputElement | null;
      const licenseInput = document.getElementById("tradeLicense") as HTMLInputElement | null;
      if (cinInput?.files?.[0]) form.append("cinDocument", cinInput.files[0]);
      if (licenseInput?.files?.[0]) form.append("tradeLicense", licenseInput.files[0]);

      const res = await api.post("/auth/register/artisan", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const data = unwrapApi<{ phone: string; message: string }>(res);
      savePendingAuth(values.email, values.password);
      toast.success(data.message ?? "Code SMS envoyé");
      router.push(`/register/verify?phone=${encodeURIComponent(data.phone)}`);
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="firstName">Prénom</Label>
          <Input id="firstName" {...register("firstName")} />
          {errors.firstName && (
            <p className="text-sm text-danger">{errors.firstName.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Nom</Label>
          <Input id="lastName" {...register("lastName")} />
          {errors.lastName && (
            <p className="text-sm text-danger">{errors.lastName.message}</p>
          )}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" autoComplete="email" {...register("email")} />
        {errors.email && <p className="text-sm text-danger">{errors.email.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Téléphone</Label>
        <Input id="phone" type="tel" placeholder="+212612345678" {...register("phone")} />
        {errors.phone && <p className="text-sm text-danger">{errors.phone.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="cinNumber">CIN (optionnel)</Label>
        <Input id="cinNumber" {...register("cinNumber")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="serviceRadiusKm">Rayon d&apos;intervention (km)</Label>
        <Input id="serviceRadiusKm" type="number" min={1} max={100} {...register("serviceRadiusKm")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="cinDocument">CIN (scan, optionnel)</Label>
        <Input id="cinDocument" type="file" accept="image/*,application/pdf" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="tradeLicense">Licence / attestation (optionnel)</Label>
        <Input id="tradeLicense" type="file" accept="image/*,application/pdf" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Mot de passe</Label>
        <Input id="password" type="password" autoComplete="new-password" {...register("password")} />
        {errors.password && <p className="text-sm text-danger">{errors.password.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
        <Input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && (
          <p className="text-sm text-danger">{errors.confirmPassword.message}</p>
        )}
      </div>
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Inscription…" : "Créer mon compte artisan"}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        <Link href="/register" className="text-primary hover:underline">
          Changer de type de compte
        </Link>
        {" · "}
        <Link href="/login" className="text-primary hover:underline">
          Se connecter
        </Link>
      </p>
    </form>
  );
}
