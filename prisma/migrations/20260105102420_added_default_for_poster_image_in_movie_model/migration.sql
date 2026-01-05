/*
  Warnings:

  - Made the column `poster_image` on table `movies` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "movies" ALTER COLUMN "poster_image" SET NOT NULL,
ALTER COLUMN "poster_image" SET DEFAULT 'default.jpg';
