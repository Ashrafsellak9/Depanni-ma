import { z } from "zod";

export const trackingUpdateSchema = z.object({
  missionId: z.string().uuid(),
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  bearing: z.coerce.number().min(0).max(360).optional(),
  speed: z.coerce.number().min(0).optional(),
});

export const trackingStartedSchema = z.object({
  missionId: z.string().uuid(),
});

export type TrackingUpdateInput = z.infer<typeof trackingUpdateSchema>;
