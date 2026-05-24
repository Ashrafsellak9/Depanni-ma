import { z } from "zod";

export const moroccanPhoneSchema = z
  .string()
  .min(1, "Téléphone requis")
  .regex(/^(\+212|0)[5-7]\d{8}$/, "Numéro marocain invalide (+2126… ou 06…)");

export const passwordSchema = z
  .string()
  .min(8, "Minimum 8 caractères")
  .regex(/[A-Z]/, "Au moins une majuscule")
  .regex(/[0-9]/, "Au moins un chiffre");
