/*
  Warnings:

  - You are about to drop the column `row` on the `seats` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[hall_id,row_id,number]` on the table `seats` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `row_id` to the `seats` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."seats_hall_id_row_number_key";

-- AlterTable
ALTER TABLE "seats" DROP COLUMN "row",
ADD COLUMN     "row_id" INTEGER NOT NULL;

-- DropEnum
DROP TYPE "public"."Row";

-- CreateTable
CREATE TABLE "Row" (
    "id" SERIAL NOT NULL,
    "label" VARCHAR(255) NOT NULL,
    "seat_capacity" INTEGER NOT NULL,
    "hall_id" INTEGER NOT NULL,

    CONSTRAINT "Row_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "seats_hall_id_row_id_number_key" ON "seats"("hall_id", "row_id", "number");

-- AddForeignKey
ALTER TABLE "Row" ADD CONSTRAINT "Row_hall_id_fkey" FOREIGN KEY ("hall_id") REFERENCES "halls"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seats" ADD CONSTRAINT "seats_row_id_fkey" FOREIGN KEY ("row_id") REFERENCES "Row"("id") ON DELETE CASCADE ON UPDATE CASCADE;
