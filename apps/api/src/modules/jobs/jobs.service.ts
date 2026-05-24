import { JobCreateSchema, JobQuerySchema } from "@depanni/validators";
import { buildPaginationMeta } from "@depanni/utils";

import { prisma } from "../../config/db.js";
import { NotFoundError } from "../../utils/errors.js";

export class JobsService {
  async list(query: unknown) {
    const { page, limit, status, categoryId } = JobQuerySchema.parse(query);
    const skip = (page - 1) * limit;

    const where = {
      ...(status ? { status } : {}),
      ...(categoryId ? { categoryId } : {}),
    };

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({ where, skip, take: limit, orderBy: { createdAt: "desc" } }),
      prisma.job.count({ where }),
    ]);

    return { jobs, meta: buildPaginationMeta(page, limit, total) };
  }

  async getById(id: string) {
    const job = await prisma.job.findUnique({ where: { id }, include: { offers: true } });
    if (!job) throw new NotFoundError("Demande");
    return job;
  }

  async create(citizenId: string, input: unknown) {
    const data = JobCreateSchema.parse(input);
    return prisma.job.create({
      data: {
        citizenId,
        categoryId: data.categoryId,
        title: data.title,
        description: data.description,
        urgency: data.urgency,
        locationLat: data.location.coordinates.lat,
        locationLng: data.location.coordinates.lng,
        address: data.location.formatted,
        city: data.location.city,
        currency: data.currency,
        status: "OPEN",
      },
    });
  }
}

export const jobsService = new JobsService();
