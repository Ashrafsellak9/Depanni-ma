import type { Prisma } from "@prisma/client";

import { prisma } from "../../config/db.js";

export async function logPaymentAudit(
  paymentId: string,
  action: string,
  actorId?: string,
  metadata?: Prisma.InputJsonValue,
): Promise<void> {
  await prisma.paymentAuditLog.create({
    data: { paymentId, action, actorId, metadata },
  });
}
