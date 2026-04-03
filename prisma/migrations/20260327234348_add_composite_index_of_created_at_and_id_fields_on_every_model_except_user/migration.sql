-- CreateIndex
CREATE INDEX "cinemas_created_at_id_idx" ON "cinemas"("created_at", "id");

-- CreateIndex
CREATE INDEX "halls_created_at_id_idx" ON "halls"("created_at", "id");

-- CreateIndex
CREATE INDEX "movies_created_at_id_idx" ON "movies"("created_at", "id");

-- CreateIndex
CREATE INDEX "reservations_created_at_id_idx" ON "reservations"("created_at", "id");

-- CreateIndex
CREATE INDEX "reviews_created_at_id_idx" ON "reviews"("created_at", "id");

-- CreateIndex
CREATE INDEX "rows_created_at_id_idx" ON "rows"("created_at", "id");

-- CreateIndex
CREATE INDEX "seats_created_at_id_idx" ON "seats"("created_at", "id");

-- CreateIndex
CREATE INDEX "showtimes_created_at_id_idx" ON "showtimes"("created_at", "id");
