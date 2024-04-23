/*
  Warnings:

  - You are about to drop the column `presetData` on the `Preset` table. All the data in the column will be lost.
  - You are about to drop the column `presetName` on the `Preset` table. All the data in the column will be lost.
  - Added the required column `name` to the `Preset` table without a default value. This is not possible if the table is not empty.
  - Added the required column `settings` to the `Preset` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Preset` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Preset" DROP COLUMN "presetData",
DROP COLUMN "presetName",
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "settings" JSONB NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL;
