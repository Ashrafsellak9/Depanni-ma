-- CreateEnum
CREATE TYPE "AddressLabel" AS ENUM ('HOME', 'OFFICE', 'OTHER');
CREATE TYPE "ArtisanVerificationStatus" AS ENUM ('UNVERIFIED', 'PENDING', 'APPROVED', 'REJECTED');
CREATE TYPE "EarningStatus" AS ENUM ('PENDING', 'PAID', 'CANCELLED');
CREATE TYPE "PayoutStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- AlterTable users
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "bio" TEXT;

-- CreateTable user_addresses
CREATE TABLE IF NOT EXISTS "user_addresses" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "label" "AddressLabel" NOT NULL DEFAULT 'HOME',
    "street" TEXT,
    "city" TEXT NOT NULL,
    "region" TEXT,
    "postalCode" TEXT,
    "country" TEXT NOT NULL DEFAULT 'MA',
    "formatted" TEXT NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "user_addresses_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "user_addresses_userId_idx" ON "user_addresses"("userId");
ALTER TABLE "user_addresses" DROP CONSTRAINT IF EXISTS "user_addresses_userId_fkey";
ALTER TABLE "user_addresses" ADD CONSTRAINT "user_addresses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable service_categories
CREATE TABLE IF NOT EXISTS "service_categories" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "nameFr" TEXT NOT NULL,
    "nameAr" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "service_categories_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "service_categories_slug_key" ON "service_categories"("slug");

-- CreateTable artisan_categories
CREATE TABLE IF NOT EXISTS "artisan_categories" (
    "artisanId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    CONSTRAINT "artisan_categories_pkey" PRIMARY KEY ("artisanId","categoryId")
);

ALTER TABLE "artisan_categories" DROP CONSTRAINT IF EXISTS "artisan_categories_artisanId_fkey";
ALTER TABLE "artisan_categories" ADD CONSTRAINT "artisan_categories_artisanId_fkey" FOREIGN KEY ("artisanId") REFERENCES "artisans"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "artisan_categories" DROP CONSTRAINT IF EXISTS "artisan_categories_categoryId_fkey";
ALTER TABLE "artisan_categories" ADD CONSTRAINT "artisan_categories_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "service_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AlterTable artisans
ALTER TABLE "artisans" ADD COLUMN IF NOT EXISTS "rejectionReason" TEXT;
ALTER TABLE "artisans" ADD COLUMN IF NOT EXISTS "isVerified" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "artisans" ADD COLUMN IF NOT EXISTS "isTopArtisan" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "artisans" ADD COLUMN IF NOT EXISTS "cinRectoUrl" TEXT;
ALTER TABLE "artisans" ADD COLUMN IF NOT EXISTS "cinVersoUrl" TEXT;
ALTER TABLE "artisans" ADD COLUMN IF NOT EXISTS "diplomaUrl" TEXT;
ALTER TABLE "artisans" ADD COLUMN IF NOT EXISTS "bio" TEXT;
ALTER TABLE "artisans" ADD COLUMN IF NOT EXISTS "specialties" TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "artisans" ADD COLUMN IF NOT EXISTS "zones" TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "artisans" ADD COLUMN IF NOT EXISTS "hourlyRate" DOUBLE PRECISION;
ALTER TABLE "artisans" ADD COLUMN IF NOT EXISTS "currentLat" DOUBLE PRECISION;
ALTER TABLE "artisans" ADD COLUMN IF NOT EXISTS "currentLng" DOUBLE PRECISION;
ALTER TABLE "artisans" ADD COLUMN IF NOT EXISTS "artisanScore" DOUBLE PRECISION NOT NULL DEFAULT 0;
ALTER TABLE "artisans" ADD COLUMN IF NOT EXISTS "completionRate" DOUBLE PRECISION NOT NULL DEFAULT 0;
ALTER TABLE "artisans" ADD COLUMN IF NOT EXISTS "avgResponseTimeSec" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "artisans" ADD COLUMN IF NOT EXISTS "cancellationRate" DOUBLE PRECISION NOT NULL DEFAULT 0;
ALTER TABLE "artisans" ADD COLUMN IF NOT EXISTS "totalEarnings" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- Convert verificationStatus to enum
ALTER TABLE "artisans" ADD COLUMN IF NOT EXISTS "verificationStatus_new" "ArtisanVerificationStatus";
UPDATE "artisans" SET "verificationStatus_new" = CASE
  WHEN "verificationStatus"::text = 'APPROVED' THEN 'APPROVED'::"ArtisanVerificationStatus"
  WHEN "verificationStatus"::text = 'REJECTED' THEN 'REJECTED'::"ArtisanVerificationStatus"
  WHEN "verificationStatus"::text = 'PENDING' THEN 'PENDING'::"ArtisanVerificationStatus"
  ELSE 'UNVERIFIED'::"ArtisanVerificationStatus"
END;
ALTER TABLE "artisans" DROP COLUMN "verificationStatus";
ALTER TABLE "artisans" RENAME COLUMN "verificationStatus_new" TO "verificationStatus";
ALTER TABLE "artisans" ALTER COLUMN "verificationStatus" SET DEFAULT 'UNVERIFIED';
ALTER TABLE "artisans" ALTER COLUMN "verificationStatus" SET NOT NULL;

-- PostGIS location column
ALTER TABLE "artisans" ADD COLUMN IF NOT EXISTS "location" geography(Point, 4326);
CREATE INDEX IF NOT EXISTS "artisans_location_gix" ON "artisans" USING GIST ("location");

-- CreateTable reviews
CREATE TABLE IF NOT EXISTS "reviews" (
    "id" TEXT NOT NULL,
    "artisanId" TEXT NOT NULL,
    "citizenId" TEXT NOT NULL,
    "jobId" TEXT,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "reviews_artisanId_idx" ON "reviews"("artisanId");
ALTER TABLE "reviews" DROP CONSTRAINT IF EXISTS "reviews_artisanId_fkey";
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_artisanId_fkey" FOREIGN KEY ("artisanId") REFERENCES "artisans"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "reviews" DROP CONSTRAINT IF EXISTS "reviews_citizenId_fkey";
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_citizenId_fkey" FOREIGN KEY ("citizenId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateTable artisan_earnings
CREATE TABLE IF NOT EXISTS "artisan_earnings" (
    "id" TEXT NOT NULL,
    "artisanId" TEXT NOT NULL,
    "jobId" TEXT,
    "grossAmount" DOUBLE PRECISION NOT NULL,
    "commission" DOUBLE PRECISION NOT NULL,
    "netAmount" DOUBLE PRECISION NOT NULL,
    "status" "EarningStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paidAt" TIMESTAMP(3),
    CONSTRAINT "artisan_earnings_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "artisan_earnings_artisanId_idx" ON "artisan_earnings"("artisanId");
ALTER TABLE "artisan_earnings" DROP CONSTRAINT IF EXISTS "artisan_earnings_artisanId_fkey";
ALTER TABLE "artisan_earnings" ADD CONSTRAINT "artisan_earnings_artisanId_fkey" FOREIGN KEY ("artisanId") REFERENCES "artisans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable payouts
CREATE TABLE IF NOT EXISTS "payouts" (
    "id" TEXT NOT NULL,
    "artisanId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" "PayoutStatus" NOT NULL DEFAULT 'PENDING',
    "reference" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    CONSTRAINT "payouts_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "payouts_artisanId_idx" ON "payouts"("artisanId");
ALTER TABLE "payouts" DROP CONSTRAINT IF EXISTS "payouts_artisanId_fkey";
ALTER TABLE "payouts" ADD CONSTRAINT "payouts_artisanId_fkey" FOREIGN KEY ("artisanId") REFERENCES "artisans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE INDEX IF NOT EXISTS "jobs_citizenId_idx" ON "jobs"("citizenId");

-- Seed default service categories
INSERT INTO "service_categories" ("id", "slug", "nameFr", "nameAr", "createdAt")
VALUES
  (gen_random_uuid()::text, 'plomberie', 'Plomberie', 'السباكة', NOW()),
  (gen_random_uuid()::text, 'electricite', 'Électricité', 'الكهرباء', NOW()),
  (gen_random_uuid()::text, 'climatisation', 'Climatisation', 'التكييف', NOW()),
  (gen_random_uuid()::text, 'serrurerie', 'Serrurerie', 'الأقفال', NOW()),
  (gen_random_uuid()::text, 'peinture', 'Peinture', 'الدهان', NOW())
ON CONFLICT ("slug") DO NOTHING;
