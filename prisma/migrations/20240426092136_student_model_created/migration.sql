-- CreateTable
CREATE TABLE "Student" (
    "id" SERIAL NOT NULL,
    "campusId" INTEGER,
    "name" TEXT NOT NULL,
    "rollNo" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'student',
    "gender" TEXT NOT NULL,
    "contactNumber" BIGINT NOT NULL,
    "dob" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "permanent_address" TEXT NOT NULL,
    "currentAddress" TEXT NOT NULL,
    "fatherName" TEXT NOT NULL,
    "motherName" TEXT NOT NULL,
    "fatherContactNumber" BIGINT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Student_email_key" ON "Student"("email");

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_campusId_fkey" FOREIGN KEY ("campusId") REFERENCES "Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;
