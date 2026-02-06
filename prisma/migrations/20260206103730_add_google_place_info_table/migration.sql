-- CreateTable
CREATE TABLE "google_place_info" (
    "id" TEXT NOT NULL,
    "placeId" TEXT NOT NULL,
    "title" TEXT,
    "address" TEXT,
    "rating" DOUBLE PRECISION,
    "reviewCount" INTEGER,
    "fetchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "google_place_info_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "google_place_info_placeId_key" ON "google_place_info"("placeId");
