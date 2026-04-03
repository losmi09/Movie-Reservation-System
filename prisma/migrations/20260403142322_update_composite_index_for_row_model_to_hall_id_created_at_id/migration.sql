-- DropIndex
DROP INDEX "rows_created_at_id_idx";

-- CreateIndex
CREATE INDEX "rows_hall_id_created_at_id_idx" ON "rows"("hall_id", "created_at", "id");
