-- AlterTable
ALTER TABLE "athletes" ADD COLUMN     "stravaRefreshToken" TEXT,
ADD COLUMN     "stravaToken" TEXT;

-- CreateTable
CREATE TABLE "activities" (
    "id" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "distance" DOUBLE PRECISION NOT NULL,
    "movingTime" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "athleteId" TEXT NOT NULL,

    CONSTRAINT "activities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "activities_externalId_key" ON "activities"("externalId");

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_athleteId_fkey" FOREIGN KEY ("athleteId") REFERENCES "athletes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
