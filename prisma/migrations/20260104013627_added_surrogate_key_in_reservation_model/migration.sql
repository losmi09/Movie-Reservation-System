-- AlterTable
ALTER TABLE "reservations" ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "reservations_pkey" PRIMARY KEY ("id");
