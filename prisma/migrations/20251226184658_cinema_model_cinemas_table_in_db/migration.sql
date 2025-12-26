/*
  Warnings:

  - You are about to drop the `Cinema` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "public"."Cinema";

-- CreateTable
CREATE TABLE "cinemas" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "city" VARCHAR(255) NOT NULL,
    "address" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cinemas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cinemas_name_key" ON "cinemas"("name");

-- CreateIndex
CREATE UNIQUE INDEX "cinemas_phone_key" ON "cinemas"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "cinemas_email_key" ON "cinemas"("email");

-- CreateIndex
CREATE UNIQUE INDEX "cinemas_name_city_key" ON "cinemas"("name", "city");
