/*
  Warnings:

  - The `body` column on the `blog` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "blog" ADD COLUMN     "content" TEXT NOT NULL DEFAULT '',
DROP COLUMN "body",
ADD COLUMN     "body" JSONB[];
