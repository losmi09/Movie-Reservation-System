/*
  Warnings:

  - You are about to drop the column `hall_id` on the `seats` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[row_id,number]` on the table `seats` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."seats" DROP CONSTRAINT "seats_hall_id_fkey";

-- DropIndex
DROP INDEX "public"."seats_hall_id_row_id_number_key";

-- AlterTable
ALTER TABLE "seats" DROP COLUMN "hall_id",
ADD COLUMN     "hallId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "seats_row_id_number_key" ON "seats"("row_id", "number");

-- AddForeignKey
ALTER TABLE "seats" ADD CONSTRAINT "seats_hallId_fkey" FOREIGN KEY ("hallId") REFERENCES "halls"("id") ON DELETE SET NULL ON UPDATE CASCADE;
