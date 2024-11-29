/*
  Warnings:

  - You are about to drop the column `marks` on the `Marks` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Marks" DROP COLUMN "marks",
ADD COLUMN     "scoredMarks" INTEGER NOT NULL DEFAULT -1,
ADD COLUMN     "totalMarks" INTEGER NOT NULL DEFAULT 100;
