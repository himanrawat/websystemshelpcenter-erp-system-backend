/*
  Warnings:

  - You are about to drop the column `totalLectureAttended` on the `Attendance` table. All the data in the column will be lost.
  - You are about to drop the column `totalLectureTaken` on the `Attendance` table. All the data in the column will be lost.
  - Added the required column `date` to the `Attendance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Attendance` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Attendance" DROP COLUMN "totalLectureAttended",
DROP COLUMN "totalLectureTaken",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Subject" ADD COLUMN     "totalLectureTaken" INTEGER NOT NULL DEFAULT 0;
