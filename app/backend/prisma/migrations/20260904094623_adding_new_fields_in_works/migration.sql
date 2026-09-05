/*
  Warnings:

  - Added the required column `description` to the `works` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "works" ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "is_selected" BOOLEAN NOT NULL DEFAULT false;
