import { z } from "zod";

const geoPointSchema = z.object({
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
});

export const updateArtisanMeSchema = z.object({
  bio: z.string().max(1000).optional(),
  specialties: z.array(z.string().min(1).max(80)).max(20).optional(),
  zones: z.array(z.string().min(1).max(80)).max(30).optional(),
  hourlyRate: z.coerce.number().min(0).max(5000).optional(),
  serviceRadiusKm: z.coerce.number().min(1).max(100).optional(),
  categoryIds: z.array(z.string().uuid()).min(1).max(10).optional(),
  baseLocation: geoPointSchema.optional(),
});

export const availabilitySchema = z.object({
  isAvailable: z.boolean(),
});

export const locationSchema = z.object({
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
});

export const nearbyQuerySchema = z.object({
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  radius: z.coerce.number().min(0.5).max(100).default(15),
  category: z.string().uuid().optional(),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export const rejectKycSchema = z.object({
  reason: z.string().min(5).max(500),
});

export type UpdateArtisanMeInput = z.infer<typeof updateArtisanMeSchema>;
export type AvailabilityInput = z.infer<typeof availabilitySchema>;
export type LocationInput = z.infer<typeof locationSchema>;
export type NearbyQueryInput = z.infer<typeof nearbyQuerySchema>;
