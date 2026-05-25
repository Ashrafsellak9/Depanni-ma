import type { JobStatus, Prisma } from "@prisma/client";

import { prisma } from "../../config/db.js";
import { ForbiddenError, NotFoundError } from "../../utils/errors.js";
import { getCitizenByUserId, getCitizenIdByUserId } from "../../utils/profile.js";
import type {
  CreateAddressInput,
  HistoryQueryInput,
  PushTokenInput,
  UpdateUserMeInput,
} from "./users.schemas.js";
import { createAddressSchema, historyQuerySchema, updateUserMeSchema } from "./users.schemas.js";

type CitizenAddress = {
  id?: string;
  label?: string;
  street?: string;
  city?: string;
  region?: string;
  postalCode?: string;
  country?: string;
  formatted?: string;
  lat?: number;
  lng?: number;
  isDefault?: boolean;
};

export class UsersService {
  async savePushToken(userId: string, input: PushTokenInput) {
    await prisma.devicePushToken.upsert({
      where: { token: input.token },
      create: {
        userId,
        token: input.token,
        platform: input.platform,
      },
      update: {
        userId,
        platform: input.platform,
      },
    });
    return { saved: true };
  }

  async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        phone: true,
        role: true,
        isVerified: true,
        locale: true,
        createdAt: true,
        updatedAt: true,
        citizen: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            addresses: true,
          },
        },
        artisan: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            kycStatus: true,
            badgeVerified: true,
            availabilityStatus: true,
          },
        },
      },
    });
    if (!user) throw new NotFoundError("Utilisateur");

    const profile = user.citizen ?? user.artisan;
    return {
      ...user,
      firstName: profile?.firstName ?? "",
      lastName: profile?.lastName ?? "",
      avatarUrl: profile?.avatar ?? null,
      addresses: user.citizen?.addresses ?? [],
    };
  }

  async getById(id: string, requesterId?: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        role: true,
        citizen: { select: { firstName: true, lastName: true, avatar: true } },
        artisan: { select: { firstName: true, lastName: true, avatar: true, bio: true } },
      },
    });
    if (!user) throw new NotFoundError("Utilisateur");

    const profile = user.citizen ?? user.artisan;
    const publicProfile = {
      id: user.id,
      role: user.role,
      firstName: profile?.firstName ?? "",
      lastName: profile?.lastName ?? "",
      avatarUrl: profile?.avatar ?? null,
      bio: user.artisan?.bio ?? null,
    };

    if (requesterId && requesterId !== id) {
      return publicProfile;
    }

    const full = await this.getMe(id);
    return full;
  }

  async updateMe(userId: string, input: unknown) {
    const data: UpdateUserMeInput = updateUserMeSchema.parse(input);
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { citizen: true, artisan: true },
    });
    if (!user) throw new NotFoundError("Utilisateur");

    const { firstName, lastName, avatarUrl, bio, locale, ...userFields } = data;

    await prisma.user.update({
      where: { id: userId },
      data: {
        ...(locale != null ? { locale } : {}),
        ...userFields,
      },
    });

    if (user.citizen && (firstName != null || lastName != null || avatarUrl != null)) {
      await prisma.citizen.update({
        where: { id: user.citizen.id },
        data: {
          ...(firstName != null ? { firstName } : {}),
          ...(lastName != null ? { lastName } : {}),
          ...(avatarUrl != null ? { avatar: avatarUrl } : {}),
        },
      });
    }

    if (user.artisan && (firstName != null || lastName != null || avatarUrl != null || bio != null)) {
      await prisma.artisan.update({
        where: { id: user.artisan.id },
        data: {
          ...(firstName != null ? { firstName } : {}),
          ...(lastName != null ? { lastName } : {}),
          ...(avatarUrl != null ? { avatar: avatarUrl } : {}),
          ...(bio != null ? { bio } : {}),
        },
      });
    }

    return this.getMe(userId);
  }

  async addAddress(userId: string, input: unknown) {
    const data: CreateAddressInput = createAddressSchema.parse(input);
    const citizen = await getCitizenByUserId(userId);

    const addresses = (citizen.addresses as CitizenAddress[]) ?? [];
    const isDefault = data.isDefault ?? addresses.length === 0;

    if (isDefault) {
      for (const a of addresses) {
        a.isDefault = false;
      }
    }

    const entry: CitizenAddress = {
      id: crypto.randomUUID(),
      label: data.label,
      street: data.street,
      city: data.city,
      region: data.region,
      postalCode: data.postalCode,
      country: data.country,
      formatted: data.formatted,
      lat: data.coordinates.lat,
      lng: data.coordinates.lng,
      isDefault,
    };

    addresses.push(entry);

    return prisma.citizen.update({
      where: { id: citizen.id },
      data: { addresses: addresses as Prisma.InputJsonValue },
    });
  }

  async deleteAddress(userId: string, addressId: string) {
    const citizen = await getCitizenByUserId(userId);
    const addresses = ((citizen.addresses as CitizenAddress[]) ?? []).filter(
      (a) => a.id !== addressId,
    );

    if (addresses.length === ((citizen.addresses as CitizenAddress[]) ?? []).length) {
      throw new NotFoundError("Adresse");
    }

    if (!addresses.some((a) => a.isDefault) && addresses.length > 0) {
      addresses[0]!.isDefault = true;
    }

    await prisma.citizen.update({
      where: { id: citizen.id },
      data: { addresses: addresses as Prisma.InputJsonValue },
    });

    return { deleted: true };
  }

  async getHistory(userId: string, query: unknown) {
    const citizenId = await getCitizenIdByUserId(userId);
    const { cursor, limit, status }: HistoryQueryInput = historyQuerySchema.parse(query);
    const { buildCursorPage, cursorWhereDesc } = await import("../../lib/pagination.js");
    const cursorFilter = cursorWhereDesc(cursor);

    const where = {
      citizenId,
      ...(status ? { status: status as JobStatus } : {}),
      ...(cursorFilter ?? {}),
    };

    const rows = await prisma.job.findMany({
      where,
      take: limit + 1,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      include: {
        offers: {
          select: {
            id: true,
            status: true,
            price: true,
            artisan: {
              select: { id: true, firstName: true, lastName: true, avatar: true },
            },
          },
        },
        mission: { select: { id: true, status: true } },
      },
    });

    return buildCursorPage(rows, limit);
  }

  async assertCitizen(userId: string): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });
    if (!user) throw new NotFoundError("Utilisateur");
    if (user.role !== "CITIZEN" && user.role !== "ADMIN") {
      throw new ForbiddenError("Réservé aux citoyens");
    }
  }
}

export const usersService = new UsersService();
