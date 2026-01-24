/*
  Warnings:

  - The primary key for the `cinemas` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `halls` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `movies` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `reservations` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `rows` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `seats` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `showtimes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "public"."halls" DROP CONSTRAINT "halls_cinema_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."reservations" DROP CONSTRAINT "reservations_seat_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."reservations" DROP CONSTRAINT "reservations_showtime_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."reservations" DROP CONSTRAINT "reservations_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."rows" DROP CONSTRAINT "rows_hall_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."seats" DROP CONSTRAINT "seats_row_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."showtimes" DROP CONSTRAINT "showtimes_cinema_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."showtimes" DROP CONSTRAINT "showtimes_hall_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."showtimes" DROP CONSTRAINT "showtimes_movie_id_fkey";

-- AlterTable
ALTER TABLE "cinemas" DROP CONSTRAINT "cinemas_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "cinemas_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "cinemas_id_seq";

-- AlterTable
ALTER TABLE "halls" DROP CONSTRAINT "halls_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "cinema_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "halls_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "halls_id_seq";

-- AlterTable
ALTER TABLE "movies" DROP CONSTRAINT "movies_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "movies_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "movies_id_seq";

-- AlterTable
ALTER TABLE "reservations" DROP CONSTRAINT "reservations_pkey",
ALTER COLUMN "showtime_id" SET DATA TYPE TEXT,
ALTER COLUMN "seat_id" SET DATA TYPE TEXT,
ALTER COLUMN "user_id" SET DATA TYPE TEXT,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "reservations_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "reservations_id_seq";

-- AlterTable
ALTER TABLE "rows" DROP CONSTRAINT "rows_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "hall_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "rows_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "rows_id_seq";

-- AlterTable
ALTER TABLE "seats" DROP CONSTRAINT "seats_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "row_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "seats_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "seats_id_seq";

-- AlterTable
ALTER TABLE "showtimes" DROP CONSTRAINT "showtimes_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "movie_id" SET DATA TYPE TEXT,
ALTER COLUMN "cinema_id" SET DATA TYPE TEXT,
ALTER COLUMN "hall_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "showtimes_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "showtimes_id_seq";

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "users_id_seq";

-- AddForeignKey
ALTER TABLE "halls" ADD CONSTRAINT "halls_cinema_id_fkey" FOREIGN KEY ("cinema_id") REFERENCES "cinemas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rows" ADD CONSTRAINT "rows_hall_id_fkey" FOREIGN KEY ("hall_id") REFERENCES "halls"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seats" ADD CONSTRAINT "seats_row_id_fkey" FOREIGN KEY ("row_id") REFERENCES "rows"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "showtimes" ADD CONSTRAINT "showtimes_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "movies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "showtimes" ADD CONSTRAINT "showtimes_cinema_id_fkey" FOREIGN KEY ("cinema_id") REFERENCES "cinemas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "showtimes" ADD CONSTRAINT "showtimes_hall_id_fkey" FOREIGN KEY ("hall_id") REFERENCES "halls"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_showtime_id_fkey" FOREIGN KEY ("showtime_id") REFERENCES "showtimes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_seat_id_fkey" FOREIGN KEY ("seat_id") REFERENCES "seats"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
