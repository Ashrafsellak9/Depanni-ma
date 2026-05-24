"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api, getApiErrorMessage } from "@/lib/api";
import { unwrapApi } from "@/lib/api-types";
import { redirectAfterLogin } from "@/auth";
import { moroccanPhoneSchema } from "@/lib/validation";
import { setAccessToken } from "@/lib/token";
import type { AuthSession } from "@/types";

const otpSchema = z.object({
  phone: moroccanPhoneSchema,
  code: z.string().regex(/^\d{6}$/, "Code à 6 chiffres"),
});

type OtpFormValues = z.infer<typeof otpSchema>;

const PENDING_AUTH_KEY = "depanni:pending-auth";

export function VerifyOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phoneParam = searchParams.get("phone") ?? "";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: { phone: phoneParam, code: "" },
  });

  const onSubmit = async (values: OtpFormValues) => {
    try {
      const res = await api.post("/auth/verify-otp", {
        phone: values.phone,
        code: values.code,
        purpose: "REGISTER",
      });
      const session = unwrapApi<AuthSession>(res);
      setAccessToken(session.accessToken);

      const pendingRaw = sessionStorage.getItem(PENDING_AUTH_KEY);
      if (pendingRaw) {
        const pending = JSON.parse(pendingRaw) as { email: string; password: string };
        sessionStorage.removeItem(PENDING_AUTH_KEY);

        const signInResult = await signIn("credentials", {
          email: pending.email,
          password: pending.password,
          redirect: false,
        });

        if (signInResult?.error) {
          toast.success("Compte vérifié — connectez-vous");
          router.push("/login");
          return;
        }
      }

      toast.success("Compte activé !");
      const role = session.user.role;
      router.push(redirectAfterLogin(role));
      router.refresh();
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="phone">Téléphone</Label>
        <Input id="phone" type="tel" placeholder="+212612345678" {...register("phone")} />
        {errors.phone && <p className="text-sm text-danger">{errors.phone.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="code">Code SMS (6 chiffres)</Label>
        <Input
          id="code"
          inputMode="numeric"
          maxLength={6}
          placeholder="123456"
          {...register("code")}
        />
        {errors.code && <p className="text-sm text-danger">{errors.code.message}</p>}
      </div>
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Vérification…" : "Valider le code"}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        <Link href="/login" className="text-primary hover:underline">
          Retour à la connexion
        </Link>
      </p>
    </form>
  );
}

export function savePendingAuth(email: string, password: string): void {
  sessionStorage.setItem(PENDING_AUTH_KEY, JSON.stringify({ email, password }));
}
