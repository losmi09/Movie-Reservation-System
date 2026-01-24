/*
  Warnings:

  - Added the required column `slug` to the `cinemas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `movies` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "cinemas" ADD COLUMN     "slug" VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE "movies" ADD COLUMN     "slug" VARCHAR(255) NOT NULL;
