/*
  Warnings:

  - Made the column `studentId` on table `Attendance` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Subject" DROP CONSTRAINT "Subject_teacherId_fkey";

-- AlterTable
ALTER TABLE "Attendance" ALTER COLUMN "studentId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Student" ALTER COLUMN "departmentId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Subject" ALTER COLUMN "teacherId" DROP NOT NULL,
ALTER COLUMN "departmentId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Teacher" ALTER COLUMN "departmentId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Test" ALTER COLUMN "departmentId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Subject" ADD CONSTRAINT "Subject_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE SET NULL ON UPDATE CASCADE;
