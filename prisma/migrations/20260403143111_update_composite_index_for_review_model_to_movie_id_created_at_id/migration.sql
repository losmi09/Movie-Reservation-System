-- DropIndex
DROP INDEX "reviews_created_at_id_idx";

-- CreateIndex
CREATE INDEX "reviews_movie_id_created_at_id_idx" ON "reviews"("movie_id", "created_at", "id");
