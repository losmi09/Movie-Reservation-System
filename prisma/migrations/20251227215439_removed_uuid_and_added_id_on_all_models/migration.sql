/*
  Warnings:

  - The primary key for the `cinemas` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `cinemas` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `halls` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `halls` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `movies` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `movies` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `cinema_id` on the `halls` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "public"."halls" DROP CONSTRAINT "halls_cinema_id_fkey";

-- AlterTable
ALTER TABLE "cinemas" DROP CONSTRAINT "cinemas_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "cinemas_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "halls" DROP CONSTRAINT "halls_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "cinema_id",
ADD COLUMN     "cinema_id" INTEGER NOT NULL,
ADD CONSTRAINT "halls_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "movies" DROP CONSTRAINT "movies_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "movies_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "halls" ADD CONSTRAINT "halls_cinema_id_fkey" FOREIGN KEY ("cinema_id") REFERENCES "cinemas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
