/*
  Warnings:

  - You are about to drop the column `name` on the `Attachment` table. All the data in the column will be lost.
  - Added the required column `filename` to the `Attachment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Attachment" DROP COLUMN "name",
ADD COLUMN     "filename" TEXT NOT NULL;
