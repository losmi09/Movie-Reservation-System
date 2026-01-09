/*
  Warnings:

  - Added the required column `row_capacity` to the `halls` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "halls" ADD COLUMN     "row_capacity" INTEGER NOT NULL;
