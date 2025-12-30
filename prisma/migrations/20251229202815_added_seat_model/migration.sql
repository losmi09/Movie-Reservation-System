-- CreateEnum
CREATE TYPE "Row" AS ENUM ('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J');

-- CreateTable
CREATE TABLE "seats" (
    "id" SERIAL NOT NULL,
    "row" "Row" NOT NULL,
    "number" INTEGER NOT NULL,

    CONSTRAINT "seats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "seats_row_number_key" ON "seats"("row", "number");
