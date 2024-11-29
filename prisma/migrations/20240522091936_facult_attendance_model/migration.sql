-- CreateTable
CREATE TABLE "FacultyAttendance" (
    "id" SERIAL NOT NULL,
    "date" DATE NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "presentTeachers" JSONB NOT NULL,

    CONSTRAINT "FacultyAttendance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FacultyAttendance_date_key" ON "FacultyAttendance"("date");
