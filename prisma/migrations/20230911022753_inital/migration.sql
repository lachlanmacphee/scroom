/*
  Warnings:

  - You are about to drop the `Data` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Data";

-- CreateTable
CREATE TABLE "Issues" (
    "id" TEXT NOT NULL,
    "contents" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "Issues_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Issues_contents_key" ON "Issues"("contents");
