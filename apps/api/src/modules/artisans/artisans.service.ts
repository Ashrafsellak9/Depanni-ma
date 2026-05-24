import { ArtisanProfileSchema } from "@depanni/validators";

import { prisma } from "../../config/db.js";
import { NotFoundError } from "../../utils/errors.js";

export class ArtisansService {
  async getById(id: string) {
    const artisan = await prisma.artisan.findUnique({
      where: { id },
      include: { user: { select: { firstName: true, lastName: true, avatarUrl: true, phone: true } } },
    });
    if (!artisan) throw new NotFoundError("Artisan");
    return artisan;
  }

  async upsertProfile(userId: string, input: unknown) {
    const data = ArtisanProfileSchema.parse(input);
    return prisma.artisan.upsert({
      where: { userId },
      create: {
        userId,
        baseLat: data.baseLocation.lat,
        baseLng: data.baseLocation.lng,
        serviceRadiusKm: data.serviceRadiusKm,
      },
      update: {
        baseLat: data.baseLocation.lat,
        baseLng: data.baseLocation.lng,
        serviceRadiusKm: data.serviceRadiusKm,
      },
    });
  }

  async setAvailability(userId: string, isAvailable: boolean) {
    return prisma.artisan.update({
      where: { userId },
      data: { isAvailable },
    });
  }
}

export const artisansService = new ArtisansService();
