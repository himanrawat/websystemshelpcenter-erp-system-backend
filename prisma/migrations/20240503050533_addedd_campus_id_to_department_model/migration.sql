/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `Department` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `campusId` to the `Department` table without a default value. This is not possible if the table is not empty.
  - Made the column `campusId` on table `Student` required. This step will fail if there are existing NULL values in that column.
  - Made the column `campusId` on table `Teacher` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Department" ADD COLUMN     "campusId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Student" ALTER COLUMN "campusId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Teacher" ALTER COLUMN "campusId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Department_code_key" ON "Department"("code");

-- AddForeignKey
ALTER TABLE "Department" ADD CONSTRAINT "Department_campusId_fkey" FOREIGN KEY ("campusId") REFERENCES "Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;
