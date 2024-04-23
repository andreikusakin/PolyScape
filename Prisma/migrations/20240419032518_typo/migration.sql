/*
  Warnings:

  - You are about to drop the column `discription` on the `Preset` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Preset" DROP COLUMN "discription",
ADD COLUMN     "description" TEXT;
