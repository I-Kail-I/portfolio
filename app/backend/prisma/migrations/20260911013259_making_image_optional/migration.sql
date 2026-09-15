-- AlterTable
ALTER TABLE "blogs" ALTER COLUMN "image_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "works" ALTER COLUMN "image_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "blogs" ADD CONSTRAINT "blogs_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "images"("id") ON DELETE CASCADE ON UPDATE CASCADE;
