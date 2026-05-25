/*
  Warnings:

  - You are about to drop the column `location` on the `artisans` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "artisans_location_gix";

-- AlterTable
ALTER TABLE "artisans" DROP COLUMN "location";
