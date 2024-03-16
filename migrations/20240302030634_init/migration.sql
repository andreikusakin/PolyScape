-- CreateTable
CREATE TABLE "Preset" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "username" TEXT NOT NULL,
    "presetData" JSONB NOT NULL,

    CONSTRAINT "Preset_pkey" PRIMARY KEY ("id")
);
