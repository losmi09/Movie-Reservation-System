/*
  Warnings:

  - Added the required column `name` to the `halls` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "halls" ADD COLUMN     "name" VARCHAR(255) NOT NULL;
