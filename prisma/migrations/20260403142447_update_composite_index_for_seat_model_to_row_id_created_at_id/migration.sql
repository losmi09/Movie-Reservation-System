-- DropIndex
DROP INDEX "seats_created_at_id_idx";

-- CreateIndex
CREATE INDEX "seats_row_id_created_at_id_idx" ON "seats"("row_id", "created_at", "id");
