-- AlterTable
ALTER TABLE "Branch" ADD COLUMN     "logo" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "Campus" ALTER COLUMN "logo" SET DEFAULT '';
