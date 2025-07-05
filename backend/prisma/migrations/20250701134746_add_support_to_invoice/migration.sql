/*
  Warnings:

  - You are about to drop the column `support` on the `Client` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Client" DROP COLUMN "support";

-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "support" TEXT;
