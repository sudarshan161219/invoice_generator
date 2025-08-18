/*
  Warnings:

  - You are about to drop the column `currency` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `customPaymentTerms` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `paymentTerms` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the `_ClientTags` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[email]` on the table `Client` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."ClientCategory" DROP CONSTRAINT "ClientCategory_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ClientTag" DROP CONSTRAINT "ClientTag_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."_ClientTags" DROP CONSTRAINT "_ClientTags_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_ClientTags" DROP CONSTRAINT "_ClientTags_B_fkey";

-- DropIndex
DROP INDEX "public"."ClientCategory_name_userId_key";

-- DropIndex
DROP INDEX "public"."ClientTag_name_userId_key";

-- AlterTable
ALTER TABLE "public"."Client" DROP COLUMN "currency",
DROP COLUMN "customPaymentTerms",
DROP COLUMN "paymentTerms",
ADD COLUMN     "currencyId" INTEGER,
ADD COLUMN     "paymentTermId" INTEGER,
ADD COLUMN     "socialLinks" JSONB,
ADD COLUMN     "taxId" TEXT,
ADD COLUMN     "taxIdType" TEXT;

-- AlterTable
ALTER TABLE "public"."ClientCategory" ADD COLUMN     "color" TEXT,
ADD COLUMN     "isDefault" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "public"."ClientTag" ADD COLUMN     "color" TEXT;

-- DropTable
DROP TABLE "public"."_ClientTags";

-- DropEnum
DROP TYPE "public"."Currency";

-- CreateTable
CREATE TABLE "public"."PaymentTerm" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "days" INTEGER,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "PaymentTerm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Currency" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Currency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_ClientTagsOnClients" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ClientTagsOnClients_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_ClientCategoryToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ClientCategoryToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_ClientTagToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ClientTagToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_PaymentTermToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_PaymentTermToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_CurrencyToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_CurrencyToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ClientTagsOnClients_B_index" ON "public"."_ClientTagsOnClients"("B");

-- CreateIndex
CREATE INDEX "_ClientCategoryToUser_B_index" ON "public"."_ClientCategoryToUser"("B");

-- CreateIndex
CREATE INDEX "_ClientTagToUser_B_index" ON "public"."_ClientTagToUser"("B");

-- CreateIndex
CREATE INDEX "_PaymentTermToUser_B_index" ON "public"."_PaymentTermToUser"("B");

-- CreateIndex
CREATE INDEX "_CurrencyToUser_B_index" ON "public"."_CurrencyToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Client_email_key" ON "public"."Client"("email");

-- AddForeignKey
ALTER TABLE "public"."Client" ADD CONSTRAINT "Client_paymentTermId_fkey" FOREIGN KEY ("paymentTermId") REFERENCES "public"."PaymentTerm"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Client" ADD CONSTRAINT "Client_currencyId_fkey" FOREIGN KEY ("currencyId") REFERENCES "public"."Currency"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_ClientTagsOnClients" ADD CONSTRAINT "_ClientTagsOnClients_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_ClientTagsOnClients" ADD CONSTRAINT "_ClientTagsOnClients_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."ClientTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_ClientCategoryToUser" ADD CONSTRAINT "_ClientCategoryToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."ClientCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_ClientCategoryToUser" ADD CONSTRAINT "_ClientCategoryToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_ClientTagToUser" ADD CONSTRAINT "_ClientTagToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."ClientTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_ClientTagToUser" ADD CONSTRAINT "_ClientTagToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_PaymentTermToUser" ADD CONSTRAINT "_PaymentTermToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."PaymentTerm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_PaymentTermToUser" ADD CONSTRAINT "_PaymentTermToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_CurrencyToUser" ADD CONSTRAINT "_CurrencyToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Currency"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_CurrencyToUser" ADD CONSTRAINT "_CurrencyToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
