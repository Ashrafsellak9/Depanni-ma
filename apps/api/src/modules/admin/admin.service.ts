import { prisma } from "../../config/db.js";

export class AdminService {
  async getDashboardStats() {
    const [users, artisans, jobs, offers] = await Promise.all([
      prisma.user.count(),
      prisma.artisan.count(),
      prisma.job.count(),
      prisma.offer.count(),
    ]);
    return { users, artisans, jobs, offers };
  }

  async listUsers(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    return prisma.user.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });
  }
}

export const adminService = new AdminService();
