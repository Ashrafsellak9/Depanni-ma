"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api, getApiErrorMessage } from "@/lib/api";
import { useGeolocation } from "@/hooks/useGeolocation";

const requestSchema = z.object({
  categoryId: z.string().uuid("Sélectionnez une catégorie"),
  title: z.string().min(5, "Titre trop court").max(120),
  description: z.string().min(20, "Décrivez votre besoin (min. 20 caractères)"),
  address: z.string().min(3),
  city: z.string().min(1).default("Casablanca"),
  urgency: z.enum(["NOW", "IN2H", "SCHEDULED"]),
  budgetMin: z.coerce.number().positive().optional(),
  budgetMax: z.coerce.number().positive().optional(),
});

type RequestFormValues = z.infer<typeof requestSchema>;

interface RequestFormProps {
  categories: { id: string; slug: string; nameFr: string }[];
}

export function RequestForm({ categories }: RequestFormProps) {
  const router = useRouter();
  const { lat, lng, loading: geoLoading, refresh } = useGeolocation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RequestFormValues>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      urgency: "NOW",
      city: "Casablanca",
    },
  });

  const onSubmit = async (values: RequestFormValues) => {
    if (lat == null || lng == null) {
      toast.error("Activez la géolocalisation pour continuer");
      return;
    }

    try {
      const { data } = await api.post<{ data: { id: string } }>("/jobs", {
        ...values,
        lat,
        lng,
      });
      toast.success("Demande publiée");
      router.push(`/missions/${data.data.id}`);
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl space-y-4">
      <div className="space-y-2">
        <Label htmlFor="categoryId">Catégorie</Label>
        <select
          id="categoryId"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          {...register("categoryId")}
        >
          <option value="">Choisir…</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nameFr}
            </option>
          ))}
        </select>
        {errors.categoryId && <p className="text-sm text-danger">{errors.categoryId.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Titre</Label>
        <Input id="title" placeholder="Ex: Fuite sous évier" {...register("title")} />
        {errors.title && <p className="text-sm text-danger">{errors.title.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          rows={4}
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          {...register("description")}
        />
        {errors.description && <p className="text-sm text-danger">{errors.description.message}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="address">Adresse</Label>
          <Input id="address" {...register("address")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="city">Ville</Label>
          <Input id="city" {...register("city")} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="urgency">Urgence</Label>
        <select
          id="urgency"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          {...register("urgency")}
        >
          <option value="NOW">Maintenant</option>
          <option value="IN2H">Dans 2 heures</option>
          <option value="SCHEDULED">Planifié</option>
        </select>
      </div>

      <div className="rounded-md border bg-surface p-3 text-sm">
        <p className="font-medium text-navy">Position GPS</p>
        {geoLoading ? (
          <p className="text-muted-foreground">Localisation en cours…</p>
        ) : lat != null && lng != null ? (
          <p className="text-muted-foreground">
            {lat.toFixed(5)}, {lng.toFixed(5)}
          </p>
        ) : (
          <Button type="button" variant="outline" size="sm" className="mt-2" onClick={refresh}>
            Activer la géolocalisation
          </Button>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting || geoLoading}>
        {isSubmitting ? "Publication…" : "Publier la demande"}
      </Button>
    </form>
  );
}
