/*
  Warnings:

  - Added the required column `adminId` to the `FacultyAttendance` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FacultyAttendance" ADD COLUMN     "adminId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "FacultyAttendance" ADD CONSTRAINT "FacultyAttendance_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;
