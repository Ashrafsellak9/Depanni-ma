"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api, getApiErrorMessage } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

const profileSchema = z.object({
  firstName: z.string().min(2, "Minimum 2 caractères"),
  lastName: z.string().min(2, "Minimum 2 caractères"),
  avatarUrl: z.string().url().optional().or(z.literal("")),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function ProfileForm() {
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      avatarUrl: "",
    },
  });

  const onSubmit = async (values: ProfileFormValues) => {
    try {
      await api.patch("/users/me", values);
      toast.success("Profil mis à jour");
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md space-y-4">
      <div className="space-y-2">
        <Label htmlFor="firstName">Prénom</Label>
        <Input id="firstName" {...register("firstName")} />
        {errors.firstName && <p className="text-sm text-danger">{errors.firstName.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="lastName">Nom</Label>
        <Input id="lastName" {...register("lastName")} />
        {errors.lastName && <p className="text-sm text-danger">{errors.lastName.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="avatarUrl">Photo (URL)</Label>
        <Input id="avatarUrl" {...register("avatarUrl")} />
      </div>
      <Button type="submit" disabled={isSubmitting}>
        Enregistrer
      </Button>
    </form>
  );
}
