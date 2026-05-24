import type { JobStatus } from "@prisma/client";

import { prisma } from "../../config/db.js";
import { ForbiddenError, NotFoundError } from "../../utils/errors.js";
import type {
  CreateAddressInput,
  HistoryQueryInput,
  UpdateUserMeInput,
} from "./users.schemas.js";
import { createAddressSchema, historyQuerySchema, updateUserMeSchema } from "./users.schemas.js";

const userSelect = {
  id: true,
  email: true,
  phone: true,
  firstName: true,
  lastName: true,
  avatarUrl: true,
  bio: true,
  role: true,
  status: true,
  locale: true,
  emailVerified: true,
  phoneVerified: true,
  createdAt: true,
  updatedAt: true,
} as const;

export class UsersService {
  async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        ...userSelect,
        addresses: {
          orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
        },
        artisan: {
          select: { id: true, verificationStatus: true, isVerified: true },
        },
      },
    });
    if (!user) throw new NotFoundError("Utilisateur");
    return user;
  }

  async getById(id: string, requesterId?: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: userSelect,
    });
    if (!user) throw new NotFoundError("Utilisateur");
    if (requesterId && requesterId !== id) {
      const { email: _e, phone: _p, ...publicProfile } = user;
      return publicProfile;
    }
    return user;
  }

  async updateMe(userId: string, input: unknown) {
    const data: UpdateUserMeInput = updateUserMeSchema.parse(input);
    return prisma.user.update({
      where: { id: userId },
      data,
      select: {
        ...userSelect,
        addresses: true,
      },
    });
  }

  async addAddress(userId: string, input: unknown) {
    const data: CreateAddressInput = createAddressSchema.parse(input);

    if (data.isDefault) {
      await prisma.userAddress.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    const count = await prisma.userAddress.count({ where: { userId } });
    const isDefault = data.isDefault ?? count === 0;

    return prisma.userAddress.create({
      data: {
        userId,
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
      },
    });
  }

  async deleteAddress(userId: string, addressId: string) {
    const address = await prisma.userAddress.findFirst({
      where: { id: addressId, userId },
    });
    if (!address) throw new NotFoundError("Adresse");

    await prisma.userAddress.delete({ where: { id: addressId } });

    if (address.isDefault) {
      const next = await prisma.userAddress.findFirst({
        where: { userId },
        orderBy: { createdAt: "desc" },
      });
      if (next) {
        await prisma.userAddress.update({
          where: { id: next.id },
          data: { isDefault: true },
        });
      }
    }

    return { deleted: true };
  }

  async getHistory(userId: string, query: unknown) {
    const { page, limit, status }: HistoryQueryInput = historyQuerySchema.parse(query);
    const skip = (page - 1) * limit;

    const where = {
      citizenId: userId,
      ...(status ? { status: status as JobStatus } : {}),
    };

    const [items, total] = await Promise.all([
      prisma.job.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          offers: {
            select: {
              id: true,
              status: true,
              amount: true,
              artisan: {
                select: {
                  id: true,
                  user: { select: { firstName: true, lastName: true } },
                },
              },
            },
          },
        },
      }),
      prisma.job.count({ where }),
    ]);

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
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
