-- AlterTable
ALTER TABLE "movies" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- CreateTable
CREATE TABLE "Cinema" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "city" VARCHAR(255) NOT NULL,
    "address" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cinema_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cinema_name_key" ON "Cinema"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Cinema_phone_key" ON "Cinema"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Cinema_email_key" ON "Cinema"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Cinema_name_city_key" ON "Cinema"("name", "city");
