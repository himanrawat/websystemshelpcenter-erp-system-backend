/*
  Warnings:

  - You are about to drop the column `role` on the `Campus` table. All the data in the column will be lost.
  - Added the required column `foundedYear` to the `Campus` table without a default value. This is not possible if the table is not empty.
  - Added the required column `campusId` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `campusId` to the `Holiday` table without a default value. This is not possible if the table is not empty.
  - Added the required column `campusId` to the `Library` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "branchName" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "Branch" ADD COLUMN     "subscriptionExpiryDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Campus" DROP COLUMN "role",
ADD COLUMN     "foundedYear" INTEGER NOT NULL,
ALTER COLUMN "logo" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "campusId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Holiday" ADD COLUMN     "campusId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Library" ADD COLUMN     "campusId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Holiday" ADD CONSTRAINT "Holiday_campusId_fkey" FOREIGN KEY ("campusId") REFERENCES "Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_campusId_fkey" FOREIGN KEY ("campusId") REFERENCES "Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Library" ADD CONSTRAINT "Library_campusId_fkey" FOREIGN KEY ("campusId") REFERENCES "Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;
