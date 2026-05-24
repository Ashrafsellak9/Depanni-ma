-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('PENDING', 'ACTIVE', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'EXPIRED');
CREATE TYPE "OfferStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'COMPLETED', 'CANCELLED');

-- AlterTable jobs
ALTER TABLE "jobs" ADD COLUMN IF NOT EXISTS "subcategory" TEXT;
ALTER TABLE "jobs" ADD COLUMN IF NOT EXISTS "photos" TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "jobs" ADD COLUMN IF NOT EXISTS "budgetMin" DOUBLE PRECISION;
ALTER TABLE "jobs" ADD COLUMN IF NOT EXISTS "budgetMax" DOUBLE PRECISION;
ALTER TABLE "jobs" ADD COLUMN IF NOT EXISTS "diffusionRadiusKm" DOUBLE PRECISION NOT NULL DEFAULT 2;
ALTER TABLE "jobs" ADD COLUMN IF NOT EXISTS "offerCount" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "jobs" ADD COLUMN IF NOT EXISTS "maxOffers" INTEGER NOT NULL DEFAULT 10;
ALTER TABLE "jobs" ADD COLUMN IF NOT EXISTS "acceptsOffers" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "jobs" ADD COLUMN IF NOT EXISTS "expiresAt" TIMESTAMP(3);
ALTER TABLE "jobs" ADD COLUMN IF NOT EXISTS "scheduledAt" TIMESTAMP(3);
ALTER TABLE "jobs" ADD COLUMN IF NOT EXISTS "acceptedOfferId" TEXT;
ALTER TABLE "jobs" ADD COLUMN IF NOT EXISTS "location" geography(Point, 4326);

UPDATE "jobs" SET "location" = ST_SetSRID(ST_MakePoint("locationLng", "locationLat"), 4326)::geography
WHERE "location" IS NULL;

-- Convert job status to enum
ALTER TABLE "jobs" ADD COLUMN IF NOT EXISTS "status_new" "JobStatus";
UPDATE "jobs" SET "status_new" = CASE
  WHEN "status"::text IN ('OPEN', 'MATCHING') THEN 'PENDING'::"JobStatus"
  WHEN "status"::text = 'ASSIGNED' THEN 'ACTIVE'::"JobStatus"
  WHEN "status"::text = 'IN_PROGRESS' THEN 'IN_PROGRESS'::"JobStatus"
  WHEN "status"::text = 'COMPLETED' THEN 'COMPLETED'::"JobStatus"
  WHEN "status"::text = 'CANCELLED' THEN 'CANCELLED'::"JobStatus"
  WHEN "status"::text = 'EXPIRED' THEN 'EXPIRED'::"JobStatus"
  ELSE 'PENDING'::"JobStatus"
END;
ALTER TABLE "jobs" DROP COLUMN "status";
ALTER TABLE "jobs" RENAME COLUMN "status_new" TO "status";
ALTER TABLE "jobs" ALTER COLUMN "status" SET DEFAULT 'PENDING';
ALTER TABLE "jobs" ALTER COLUMN "status" SET NOT NULL;

CREATE INDEX IF NOT EXISTS "jobs_status_idx" ON "jobs"("status");
CREATE INDEX IF NOT EXISTS "jobs_city_idx" ON "jobs"("city");
CREATE INDEX IF NOT EXISTS "jobs_categoryId_idx" ON "jobs"("categoryId");
CREATE INDEX IF NOT EXISTS "jobs_location_gix" ON "jobs" USING GIST ("location");

CREATE UNIQUE INDEX IF NOT EXISTS "jobs_acceptedOfferId_key" ON "jobs"("acceptedOfferId");

ALTER TABLE "jobs" DROP CONSTRAINT IF EXISTS "jobs_categoryId_fkey";
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "service_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AlterTable offers
ALTER TABLE "offers" ADD COLUMN IF NOT EXISTS "etaMinutes" INTEGER;
ALTER TABLE "offers" ADD COLUMN IF NOT EXISTS "message" TEXT;

ALTER TABLE "offers" ADD COLUMN IF NOT EXISTS "status_new" "OfferStatus";
UPDATE "offers" SET "status_new" = CASE
  WHEN "status"::text = 'ACCEPTED' THEN 'ACCEPTED'::"OfferStatus"
  WHEN "status"::text = 'REJECTED' THEN 'REJECTED'::"OfferStatus"
  WHEN "status"::text = 'COMPLETED' THEN 'COMPLETED'::"OfferStatus"
  WHEN "status"::text = 'CANCELLED' THEN 'CANCELLED'::"OfferStatus"
  ELSE 'PENDING'::"OfferStatus"
END;
ALTER TABLE "offers" DROP COLUMN "status";
ALTER TABLE "offers" RENAME COLUMN "status_new" TO "status";
ALTER TABLE "offers" ALTER COLUMN "status" SET DEFAULT 'PENDING';
ALTER TABLE "offers" ALTER COLUMN "status" SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS "offers_jobId_artisanId_key" ON "offers"("jobId", "artisanId");
CREATE INDEX IF NOT EXISTS "offers_jobId_idx" ON "offers"("jobId");

ALTER TABLE "jobs" DROP CONSTRAINT IF EXISTS "jobs_acceptedOfferId_fkey";
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_acceptedOfferId_fkey" FOREIGN KEY ("acceptedOfferId") REFERENCES "offers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
