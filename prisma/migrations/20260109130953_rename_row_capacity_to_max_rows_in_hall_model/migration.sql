/*
  Warnings:

  - You are about to drop the column `row_capacity` on the `halls` table. All the data in the column will be lost.
  - Added the required column `max_rows` to the `halls` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "halls" DROP COLUMN "row_capacity",
ADD COLUMN     "max_rows" INTEGER NOT NULL;
