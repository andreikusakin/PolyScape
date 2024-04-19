-- CreateTable
CREATE TABLE "Preset" (
    "id" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "presetName" TEXT NOT NULL,
    "discription" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "presetData" JSONB NOT NULL,

    CONSTRAINT "Preset_pkey" PRIMARY KEY ("id")
);
