/*
  Warnings:

  - You are about to drop the column `hallId` on the `seats` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."seats" DROP CONSTRAINT "seats_hallId_fkey";

-- AlterTable
ALTER TABLE "seats" DROP COLUMN "hallId";
