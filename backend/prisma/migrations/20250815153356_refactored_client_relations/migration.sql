/*
  Warnings:

  - The `paymentTerms` column on the `Client` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[name,userId]` on the table `ClientCategory` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,userId]` on the table `ClientTag` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `ClientCategory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `ClientTag` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."PaymentTermsEnum" AS ENUM ('net15', 'net30', 'net45', 'dueOnReceipt');

-- DropIndex
DROP INDEX "public"."ClientTag_name_key";

-- AlterTable
ALTER TABLE "public"."Client" ADD COLUMN     "customPaymentTerms" TEXT,
DROP COLUMN "paymentTerms",
ADD COLUMN     "paymentTerms" "public"."PaymentTermsEnum";

-- AlterTable
ALTER TABLE "public"."ClientCategory" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."ClientTag" ADD COLUMN     "userId" INTEGER NOT NULL;

-- DropEnum
DROP TYPE "public"."PaymentTerms";

-- CreateIndex
CREATE UNIQUE INDEX "ClientCategory_name_userId_key" ON "public"."ClientCategory"("name", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "ClientTag_name_userId_key" ON "public"."ClientTag"("name", "userId");

-- AddForeignKey
ALTER TABLE "public"."ClientTag" ADD CONSTRAINT "ClientTag_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ClientCategory" ADD CONSTRAINT "ClientCategory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
