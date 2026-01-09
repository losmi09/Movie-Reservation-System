/*
  Warnings:

  - You are about to drop the `Row` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Row" DROP CONSTRAINT "Row_hall_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."seats" DROP CONSTRAINT "seats_row_id_fkey";

-- DropTable
DROP TABLE "public"."Row";

-- CreateTable
CREATE TABLE "rows" (
    "id" SERIAL NOT NULL,
    "label" VARCHAR(255) NOT NULL,
    "seat_capacity" INTEGER NOT NULL,
    "hall_id" INTEGER NOT NULL,

    CONSTRAINT "rows_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "rows_label_hall_id_key" ON "rows"("label", "hall_id");

-- AddForeignKey
ALTER TABLE "rows" ADD CONSTRAINT "rows_hall_id_fkey" FOREIGN KEY ("hall_id") REFERENCES "halls"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seats" ADD CONSTRAINT "seats_row_id_fkey" FOREIGN KEY ("row_id") REFERENCES "rows"("id") ON DELETE CASCADE ON UPDATE CASCADE;
