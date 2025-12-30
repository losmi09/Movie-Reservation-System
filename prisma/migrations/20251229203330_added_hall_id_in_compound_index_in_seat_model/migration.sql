/*
  Warnings:

  - A unique constraint covering the columns `[hall_id,row,number]` on the table `seats` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."seats_row_number_key";

-- CreateIndex
CREATE UNIQUE INDEX "seats_hall_id_row_number_key" ON "seats"("hall_id", "row", "number");
