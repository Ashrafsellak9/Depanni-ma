import { ProfileUpdateSchema } from "@depanni/validators";

import { prisma } from "../../config/db.js";
import { NotFoundError } from "../../utils/errors.js";

export class UsersService {
  async getById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        phone: true,
        firstName: true,
        lastName: true,
        avatarUrl: true,
        role: true,
        status: true,
        locale: true,
        createdAt: true,
      },
    });
    if (!user) throw new NotFoundError("Utilisateur");
    return user;
  }

  async updateProfile(userId: string, input: unknown) {
    const data = ProfileUpdateSchema.parse(input);
    return prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        avatarUrl: true,
        locale: true,
      },
    });
  }
}

export const usersService = new UsersService();
