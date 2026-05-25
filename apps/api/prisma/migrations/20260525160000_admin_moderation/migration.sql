-- Admin moderation: account status, KYC tracking, disputes, audit log

CREATE TYPE "AccountStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'BANNED');

ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "accountStatus" "AccountStatus" NOT NULL DEFAULT 'ACTIVE';

ALTER TABLE "artisans" ADD COLUMN IF NOT EXISTS "kycReviewedAt" TIMESTAMP(3);
ALTER TABLE "artisans" ADD COLUMN IF NOT EXISTS "kycRejectReason" TEXT;

ALTER TABLE "payments" ADD COLUMN IF NOT EXISTS "disputeOpenedAt" TIMESTAMP(3);
ALTER TABLE "payments" ADD COLUMN IF NOT EXISTS "disputeReason" TEXT;

CREATE TABLE IF NOT EXISTS "admin_audit_logs" (
    "id" TEXT NOT NULL,
    "targetType" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "actorId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "admin_audit_logs_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "admin_audit_logs_targetType_targetId_idx" ON "admin_audit_logs"("targetType", "targetId");
CREATE INDEX IF NOT EXISTS "admin_audit_logs_actorId_idx" ON "admin_audit_logs"("actorId");
CREATE INDEX IF NOT EXISTS "admin_audit_logs_createdAt_idx" ON "admin_audit_logs"("createdAt");
