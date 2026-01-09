/*
  Warnings:

  - You are about to drop the column `createdAt` on the `cinemas` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `cinemas` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `halls` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `halls` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `movies` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `movies` table. All the data in the column will be lost.
  - Added the required column `updated_at` to the `cinemas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `halls` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `movies` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "cinemas" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "halls" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "movies" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;
