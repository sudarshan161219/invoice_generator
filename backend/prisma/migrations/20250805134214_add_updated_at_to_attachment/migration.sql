/*
  Warnings:

  - Added the required column `updatedAt` to the `Attachment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
-- ALTER TABLE "Attachment" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
ALTER TABLE "Attachment" ADD COLUMN "updatedAt" TIMESTAMP NOT NULL DEFAULT now();
