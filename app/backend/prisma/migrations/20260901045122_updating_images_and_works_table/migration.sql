/*
  Warnings:

  - Added the required column `image_id` to the `works` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "images" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "works" ADD COLUMN     "image_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "works" ADD CONSTRAINT "works_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "images"("id") ON DELETE CASCADE ON UPDATE CASCADE;
