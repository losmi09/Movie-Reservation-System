-- CreateEnum
CREATE TYPE "Status" AS ENUM ('confirmed', 'cancelled', 'waitlist');

-- CreateTable
CREATE TABLE "reservations" (
    "showtime_id" INTEGER NOT NULL,
    "seat_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'confirmed'
);

-- CreateIndex
CREATE UNIQUE INDEX "reservations_showtime_id_seat_id_key" ON "reservations"("showtime_id", "seat_id");

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_showtime_id_fkey" FOREIGN KEY ("showtime_id") REFERENCES "showtimes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_seat_id_fkey" FOREIGN KEY ("seat_id") REFERENCES "seats"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
