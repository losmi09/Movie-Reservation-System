-- DropIndex
DROP INDEX "reservations_created_at_id_idx";

-- DropIndex
DROP INDEX "showtimes_created_at_id_idx";

-- CreateIndex
CREATE INDEX "reservations_user_id_created_at_id_idx" ON "reservations"("user_id", "created_at", "id");
