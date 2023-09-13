-- CreateTable
CREATE TABLE "TestData" (
    "id" TEXT NOT NULL,
    "contents" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "TestData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TestData_contents_key" ON "TestData"("contents");
