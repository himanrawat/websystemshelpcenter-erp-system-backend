-- CreateTable
CREATE TABLE "TimeTable" (
    "id" SERIAL NOT NULL,
    "departmentId" INTEGER NOT NULL,
    "departmentName" TEXT,
    "monday" JSONB,
    "tuesday" JSONB,
    "wednesday" JSONB,
    "thursday" JSONB,
    "friday" JSONB,
    "saturday" JSONB,

    CONSTRAINT "TimeTable_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TimeTable_departmentId_key" ON "TimeTable"("departmentId");
