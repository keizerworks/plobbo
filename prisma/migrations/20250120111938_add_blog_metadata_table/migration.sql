/*
  Warnings:

  - Added the required column `published_date` to the `blog` table without a default value. This is not possible if the table is not empty.
  - Made the column `created_at` on table `blog` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `blog` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "blog" ADD COLUMN     "published_date" TIMESTAMPTZ(6) NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET NOT NULL;

-- CreateTable
CREATE TABLE "blog_metadata" (
    "id" UUID NOT NULL,
    "blog_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "keywords" TEXT,
    "og_title" TEXT,
    "og_description" TEXT,
    "og_image" TEXT,
    "og_url" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "blog_metadata_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "blog_metadata_blog_id_key" ON "blog_metadata"("blog_id");

-- AddForeignKey
ALTER TABLE "blog_metadata" ADD CONSTRAINT "blog_metadata_blog_id_fkey" FOREIGN KEY ("blog_id") REFERENCES "blog"("id") ON DELETE CASCADE ON UPDATE CASCADE;
