/*
  Warnings:

  - Added the required column `hall_id` to the `seats` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "seats" ADD COLUMN     "hall_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "seats" ADD CONSTRAINT "seats_hall_id_fkey" FOREIGN KEY ("hall_id") REFERENCES "halls"("id") ON DELETE CASCADE ON UPDATE CASCADE;
