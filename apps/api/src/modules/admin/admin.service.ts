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
      prisma.artisan.count({ where: { verificationStatus: "PENDING" } }),
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
        status: true,
        createdAt: true,
      },
    });
  }

  async listKycPending(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      prisma.artisan.findMany({
        where: { verificationStatus: "PENDING" },
        skip,
        take: limit,
        orderBy: { updatedAt: "desc" },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
            },
          },
        },
      }),
      prisma.artisan.count({ where: { verificationStatus: "PENDING" } }),
    ]);

    const withSignedDocs = await Promise.all(
      items.map(async (artisan) => ({
        ...artisan,
        kycDocuments: await this.signedKycUrls(artisan),
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
        verificationStatus: "APPROVED",
        isVerified: true,
        rejectionReason: null,
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
        verificationStatus: "REJECTED",
        isVerified: false,
        isAvailable: false,
        rejectionReason: reason,
      },
    });
  }

  private async signedKycUrls(artisan: {
    cinDocumentUrl: string | null;
    cinRectoUrl: string | null;
    cinVersoUrl: string | null;
    diplomaUrl: string | null;
    tradeLicenseUrl: string | null;
  }) {
    const docs: Record<string, string> = {};
    const map = {
      cinRecto: artisan.cinRectoUrl ?? artisan.cinDocumentUrl,
      cinVerso: artisan.cinVersoUrl,
      diploma: artisan.diplomaUrl ?? artisan.tradeLicenseUrl,
    };

    for (const [key, value] of Object.entries(map)) {
      if (!value) continue;
      try {
        docs[key] = await getSignedPrivateUrl(extractS3Key(value));
      } catch {
        docs[key] = value;
      }
    }
    return docs;
  }
}

export const adminService = new AdminService();
