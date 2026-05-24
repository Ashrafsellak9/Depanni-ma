/*
  Warnings:

  - You are about to drop the column `location` on the `artisans` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "artisans" DROP CONSTRAINT "artisans_userId_fkey";

-- DropIndex
DROP INDEX "artisans_location_gix";

-- AlterTable
ALTER TABLE "artisans" DROP COLUMN "location",
ALTER COLUMN "isAvailable" SET DEFAULT false;

-- AddForeignKey
ALTER TABLE "artisans" ADD CONSTRAINT "artisans_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
