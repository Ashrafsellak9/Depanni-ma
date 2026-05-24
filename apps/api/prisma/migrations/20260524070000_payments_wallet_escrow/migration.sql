-- CreateEnum
CREATE TYPE "ArtisanSubscriptionTier" AS ENUM ('STANDARD', 'PREMIUM', 'PRO');
CREATE TYPE "PaymentMethod" AS ENUM ('CARD', 'CASH', 'WALLET');
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'HELD', 'ESCROW', 'RELEASED', 'REFUNDED', 'FAILED', 'DISPUTED', 'FROZEN');
CREATE TYPE "WalletTransactionType" AS ENUM ('TOPUP', 'ESCROW_HOLD', 'ESCROW_RELEASE', 'COMMISSION', 'PAYOUT', 'REFUND', 'ADJUSTMENT');
CREATE TYPE "RefundStatus" AS ENUM ('INITIATED', 'EXECUTED', 'FAILED');

-- AlterTable artisans
ALTER TABLE "artisans" ADD COLUMN IF NOT EXISTS "subscriptionTier" "ArtisanSubscriptionTier" NOT NULL DEFAULT 'STANDARD';

-- CreateTable wallets
CREATE TABLE IF NOT EXISTS "wallets" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'MAD',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "wallets_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "wallets_userId_key" ON "wallets"("userId");
ALTER TABLE "wallets" DROP CONSTRAINT IF EXISTS "wallets_userId_fkey";
ALTER TABLE "wallets" ADD CONSTRAINT "wallets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable payments
CREATE TABLE IF NOT EXISTS "payments" (
    "id" TEXT NOT NULL,
    "idempotencyKey" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "citizenId" TEXT NOT NULL,
    "artisanId" TEXT,
    "method" "PaymentMethod" NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'MAD',
    "commissionRate" DOUBLE PRECISION NOT NULL,
    "commissionAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "artisanNetAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "cmiOrderId" TEXT,
    "cmiTransactionId" TEXT,
    "heldAt" TIMESTAMP(3),
    "escrowAt" TIMESTAMP(3),
    "releasedAt" TIMESTAMP(3),
    "refundedAt" TIMESTAMP(3),
    "disputeOpenedAt" TIMESTAMP(3),
    "disputeResolveBy" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "payments_idempotencyKey_key" ON "payments"("idempotencyKey");
CREATE UNIQUE INDEX IF NOT EXISTS "payments_cmiOrderId_key" ON "payments"("cmiOrderId");
CREATE INDEX IF NOT EXISTS "payments_jobId_idx" ON "payments"("jobId");
CREATE INDEX IF NOT EXISTS "payments_citizenId_idx" ON "payments"("citizenId");
CREATE INDEX IF NOT EXISTS "payments_artisanId_idx" ON "payments"("artisanId");
CREATE INDEX IF NOT EXISTS "payments_status_idx" ON "payments"("status");

ALTER TABLE "payments" DROP CONSTRAINT IF EXISTS "payments_jobId_fkey";
ALTER TABLE "payments" ADD CONSTRAINT "payments_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "jobs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "payments" DROP CONSTRAINT IF EXISTS "payments_citizenId_fkey";
ALTER TABLE "payments" ADD CONSTRAINT "payments_citizenId_fkey" FOREIGN KEY ("citizenId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "payments" DROP CONSTRAINT IF EXISTS "payments_artisanId_fkey";
ALTER TABLE "payments" ADD CONSTRAINT "payments_artisanId_fkey" FOREIGN KEY ("artisanId") REFERENCES "artisans"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateTable wallet_transactions
CREATE TABLE IF NOT EXISTS "wallet_transactions" (
    "id" TEXT NOT NULL,
    "walletId" TEXT NOT NULL,
    "type" "WalletTransactionType" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "balanceAfter" DOUBLE PRECISION NOT NULL,
    "paymentId" TEXT,
    "reference" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "wallet_transactions_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "wallet_transactions_walletId_idx" ON "wallet_transactions"("walletId");
CREATE INDEX IF NOT EXISTS "wallet_transactions_paymentId_idx" ON "wallet_transactions"("paymentId");
ALTER TABLE "wallet_transactions" DROP CONSTRAINT IF EXISTS "wallet_transactions_walletId_fkey";
ALTER TABLE "wallet_transactions" ADD CONSTRAINT "wallet_transactions_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "wallets"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "wallet_transactions" DROP CONSTRAINT IF EXISTS "wallet_transactions_paymentId_fkey";
ALTER TABLE "wallet_transactions" ADD CONSTRAINT "wallet_transactions_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "payments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateTable payment_audit_logs
CREATE TABLE IF NOT EXISTS "payment_audit_logs" (
    "id" TEXT NOT NULL,
    "paymentId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "actorId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "payment_audit_logs_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "payment_audit_logs_paymentId_idx" ON "payment_audit_logs"("paymentId");
ALTER TABLE "payment_audit_logs" DROP CONSTRAINT IF EXISTS "payment_audit_logs_paymentId_fkey";
ALTER TABLE "payment_audit_logs" ADD CONSTRAINT "payment_audit_logs_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "payments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable refunds
CREATE TABLE IF NOT EXISTS "refunds" (
    "id" TEXT NOT NULL,
    "paymentId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" "RefundStatus" NOT NULL DEFAULT 'INITIATED',
    "reason" TEXT,
    "initiatedBy" TEXT NOT NULL,
    "executedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "refunds_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "refunds_paymentId_idx" ON "refunds"("paymentId");
ALTER TABLE "refunds" DROP CONSTRAINT IF EXISTS "refunds_paymentId_fkey";
ALTER TABLE "refunds" ADD CONSTRAINT "refunds_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "payments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AlterTable payouts
ALTER TABLE "payouts" ADD COLUMN IF NOT EXISTS "batchId" TEXT;
ALTER TABLE "payouts" ADD COLUMN IF NOT EXISTS "initiatedBy" TEXT;
ALTER TABLE "payouts" ADD COLUMN IF NOT EXISTS "metadata" JSONB;
CREATE INDEX IF NOT EXISTS "payouts_batchId_idx" ON "payouts"("batchId");
