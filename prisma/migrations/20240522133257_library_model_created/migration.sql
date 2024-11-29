-- CreateTable
CREATE TABLE "Library" (
    "id" SERIAL NOT NULL,
    "file" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "Library_pkey" PRIMARY KEY ("id")
);
