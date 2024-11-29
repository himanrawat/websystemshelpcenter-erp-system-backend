-- CreateTable
CREATE TABLE "Support" (
    "id" SERIAL NOT NULL,
    "complaintNo" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "contactNo" BIGINT NOT NULL,
    "email" TEXT NOT NULL,
    "query" TEXT NOT NULL,

    CONSTRAINT "Support_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Support_complaintNo_key" ON "Support"("complaintNo");
