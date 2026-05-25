"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@depanni/ui";

import { loginAdmin } from "@/services/adminApi";
import { useAuthStore } from "@/store/authStore";

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit } = useForm<LoginForm>({
    defaultValues: { email: "admin@depanni.ma", password: "Depanni@2026!" },
  });

  const onSubmit = handleSubmit(async (values) => {
    setLoading(true);
    try {
      const session = await loginAdmin(values.email, values.password);
      if (session.user.role !== "ADMIN") {
        toast.error("Accès réservé aux administrateurs");
        return;
      }
      setSession(
        {
          id: session.user.id,
          email: session.user.email,
          phone: session.user.phone,
          role: session.user.role,
        },
        session.accessToken,
      );
      toast.success("Connexion réussie");
      router.replace("/");
    } catch {
      toast.error("Identifiants invalides");
    } finally {
      setLoading(false);
    }
  });

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-900 p-4">
      <Card className="w-full max-w-md border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="text-center text-xl">DEPANNI Admin</CardTitle>
          <p className="text-center text-sm text-slate-500">Connexion administrateur</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Email</label>
              <input
                type="email"
                {...register("email", { required: true })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Mot de passe</label>
              <input
                type="password"
                {...register("password", { required: true })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Connexion…" : "Se connecter"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
