/*
  Warnings:

  - You are about to drop the column `categoryType` on the `Client` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Client" DROP COLUMN "categoryType";

-- DropEnum
DROP TYPE "public"."ClientCategoryEnum";
