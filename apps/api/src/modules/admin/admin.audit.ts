import type { Prisma } from "@prisma/client";

import { prisma } from "../../config/db.js";

export async function logAdminAction(
  actorId: string,
  targetType: string,
  targetId: string,
  action: string,
  metadata?: Record<string, unknown>,
): Promise<void> {
  await prisma.adminAuditLog.create({
    data: {
      targetType,
      targetId,
      actorId,
      action,
      metadata: (metadata ?? undefined) as Prisma.InputJsonValue | undefined,
    },
  });
}

export async function getTargetAuditLog(targetType: string, targetId: string, limit = 50) {
  return prisma.adminAuditLog.findMany({
    where: { targetType, targetId },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}
