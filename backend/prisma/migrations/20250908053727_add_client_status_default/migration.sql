/*
  Warnings:

  - A unique constraint covering the columns `[name,userId]` on the table `ClientCategory` will be added. If there are existing duplicate values, this will fail.
  - Made the column `status` on table `Client` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Client" ALTER COLUMN "status" SET NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'active';

-- CreateIndex
CREATE UNIQUE INDEX "ClientCategory_name_userId_key" ON "public"."ClientCategory"("name", "userId");
