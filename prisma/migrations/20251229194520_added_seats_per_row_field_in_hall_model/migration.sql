/*
  Warnings:

  - Added the required column `seats_per_row` to the `halls` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "halls" ADD COLUMN     "seats_per_row" INTEGER NOT NULL;
