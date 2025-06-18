/*
  Warnings:

  - Added the required column `fileKey` to the `ProductImages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fileKey` to the `ProductInfoImages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProductImages" ADD COLUMN     "fileKey" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ProductInfoImages" ADD COLUMN     "fileKey" TEXT NOT NULL;
