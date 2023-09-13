/*
  Warnings:

  - You are about to drop the `TestData` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "TestData";

-- CreateTable
CREATE TABLE "Data" (
    "id" TEXT NOT NULL,
    "contents" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "Data_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Data_contents_key" ON "Data"("contents");
