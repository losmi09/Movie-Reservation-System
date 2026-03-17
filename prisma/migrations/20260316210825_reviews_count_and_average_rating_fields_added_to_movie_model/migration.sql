-- AlterTable
ALTER TABLE "movies" ADD COLUMN     "average_rating" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "reviews_count" INTEGER NOT NULL DEFAULT 0;
