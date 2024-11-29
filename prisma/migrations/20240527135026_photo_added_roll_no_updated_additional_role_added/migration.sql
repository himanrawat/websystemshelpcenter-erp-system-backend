-- DropIndex
DROP INDEX "Student_rollNo_key";

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "photo" TEXT;

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "photo" TEXT;

-- AlterTable
ALTER TABLE "Teacher" ADD COLUMN     "AdditionalRole" TEXT NOT NULL DEFAULT 'teacher',
ADD COLUMN     "photo" TEXT;
