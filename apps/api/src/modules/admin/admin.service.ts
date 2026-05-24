import { prisma } from "../../config/db.js";
import { extractS3Key, getSignedPrivateUrl } from "../../config/s3.js";
import { NotFoundError } from "../../utils/errors.js";
import { refreshArtisanMetrics } from "../artisans/artisans.score.js";
import { rejectKycSchema } from "../artisans/artisans.schemas.js";

export class AdminService {
  async getDashboardStats() {
    const [users, artisans, jobs, offers, kycPending] = await Promise.all([
      prisma.user.count(),
      prisma.artisan.count(),
      prisma.job.count(),
      prisma.offer.count(),
      prisma.artisan.count({ where: { kycStatus: "PENDING" } }),
    ]);
    return { users, artisans, jobs, offers, kycPending };
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
        isVerified: true,
        createdAt: true,
      },
    });
  }

  async listKycPending(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      prisma.artisan.findMany({
        where: { kycStatus: "PENDING" },
        skip,
        take: limit,
        orderBy: { updatedAt: "desc" },
        include: {
          user: { select: { id: true, email: true, phone: true } },
        },
      }),
      prisma.artisan.count({ where: { kycStatus: "PENDING" } }),
    ]);

    const withSignedDocs = await Promise.all(
      items.map(async (artisan) => ({
        ...artisan,
        kycDocuments: await this.signedKycUrls(artisan.kycDocUrls),
      })),
    );

    return { items: withSignedDocs, total, page, limit };
  }

  async approveKyc(artisanId: string) {
    const artisan = await prisma.artisan.findUnique({ where: { id: artisanId } });
    if (!artisan) throw new NotFoundError("Artisan");

    const updated = await prisma.artisan.update({
      where: { id: artisanId },
      data: {
        kycStatus: "APPROVED",
        badgeVerified: true,
      },
    });

    await refreshArtisanMetrics(artisanId);
    return updated;
  }

  async rejectKyc(artisanId: string, input: unknown) {
    const { reason } = rejectKycSchema.parse(input);
    const artisan = await prisma.artisan.findUnique({ where: { id: artisanId } });
    if (!artisan) throw new NotFoundError("Artisan");

    return prisma.artisan.update({
      where: { id: artisanId },
      data: {
        kycStatus: "REJECTED",
        badgeVerified: false,
        availabilityStatus: "OFFLINE",
        bio: reason ? `${artisan.bio ?? ""}\n[KYC refusé: ${reason}]`.trim() : artisan.bio,
      },
    });
  }

  private async signedKycUrls(urls: string[]) {
    const docs: Record<string, string> = {};
    for (let i = 0; i < urls.length; i++) {
      const value = urls[i];
      if (!value) continue;
      try {
        docs[`doc_${i + 1}`] = await getSignedPrivateUrl(extractS3Key(value));
      } catch {
        docs[`doc_${i + 1}`] = value;
      }
    }
    return docs;
  }
}

export const adminService = new AdminService();
