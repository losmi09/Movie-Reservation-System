/*
  Warnings:

  - A unique constraint covering the columns `[cinema_id,name]` on the table `halls` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "halls_cinema_id_name_key" ON "halls"("cinema_id", "name");
