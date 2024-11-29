-- AlterTable
ALTER TABLE "Leave" ADD COLUMN     "name" TEXT;

-- AlterTable
ALTER TABLE "Library" ADD COLUMN     "subject" TEXT,
ADD COLUMN     "teacherId" INTEGER,
ADD COLUMN     "teacherName" TEXT;
