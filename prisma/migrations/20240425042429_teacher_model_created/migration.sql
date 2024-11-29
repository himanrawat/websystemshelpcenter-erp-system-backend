-- CreateTable
CREATE TABLE "Teacher" (
    "id" SERIAL NOT NULL,
    "campusId" INTEGER,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'teacher',
    "subject" TEXT,
    "teaching_class" TEXT,
    "gender" TEXT NOT NULL,
    "contactNumber" INTEGER NOT NULL,
    "dob" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "permanent_address" TEXT NOT NULL,
    "currentAddress" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "Teacher_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_email_key" ON "Teacher"("email");

-- AddForeignKey
ALTER TABLE "Teacher" ADD CONSTRAINT "Teacher_campusId_fkey" FOREIGN KEY ("campusId") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;
