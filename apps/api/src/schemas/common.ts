import { z } from "zod";

export const uuidParamSchema = z.object({
  id: z.string().uuid(),
});

export const jobIdParamSchema = z.object({
  jobId: z.string().uuid(),
});

export const offerIdParamSchema = z.object({
  jobId: z.string().uuid(),
  offerId: z.string().uuid(),
});

export const latLngQuerySchema = z.object({
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
});
