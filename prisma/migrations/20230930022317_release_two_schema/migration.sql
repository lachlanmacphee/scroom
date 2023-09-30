-- AlterTable
ALTER TABLE "Issue" ADD COLUMN     "estimate" INTEGER,
ADD COLUMN     "type" TEXT,
ADD COLUMN     "userId" TEXT;

-- AddForeignKey
ALTER TABLE "Issue" ADD CONSTRAINT "Issue_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
