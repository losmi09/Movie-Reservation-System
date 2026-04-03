-- DropIndex
DROP INDEX "halls_created_at_id_idx";

-- CreateIndex
CREATE INDEX "halls_cinema_id_created_at_id_idx" ON "halls"("cinema_id", "created_at", "id");
