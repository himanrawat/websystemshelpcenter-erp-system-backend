/*
  Warnings:

  - You are about to drop the column `totalLectures` on the `Subject` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Department_code_key";

-- AlterTable
ALTER TABLE "Department" ALTER COLUMN "code" SET DEFAULT '';

-- AlterTable
ALTER TABLE "Subject" DROP COLUMN "totalLectures";
