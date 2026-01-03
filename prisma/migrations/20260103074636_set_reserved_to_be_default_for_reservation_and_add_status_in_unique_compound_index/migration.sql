/*
  Warnings:

  - A unique constraint covering the columns `[status,seat_id,showtime_id]` on the table `reservations` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."reservations_showtime_id_seat_id_key";

-- AlterTable
ALTER TABLE "reservations" ALTER COLUMN "status" SET DEFAULT 'reserved';

-- CreateIndex
CREATE UNIQUE INDEX "reservations_status_seat_id_showtime_id_key" ON "reservations"("status", "seat_id", "showtime_id");
