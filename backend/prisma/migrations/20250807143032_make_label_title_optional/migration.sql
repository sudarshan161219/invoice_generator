/*
  Warnings:

  - You are about to drop the column `notes` on the `Invoice` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "NoteType" AS ENUM ('general', 'invoiceRelated');

-- AlterTable
ALTER TABLE "Attachment" ALTER COLUMN "updatedAt" DROP DEFAULT,
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "ClientNote" ADD COLUMN     "invoiceId" INTEGER,
ADD COLUMN     "label" JSONB,
ADD COLUMN     "noteType" "NoteType" NOT NULL DEFAULT 'general',
ADD COLUMN     "title" TEXT;

-- AlterTable
ALTER TABLE "Invoice" DROP COLUMN "notes";

-- CreateIndex
CREATE INDEX "ClientNote_invoiceId_idx" ON "ClientNote"("invoiceId");

-- AddForeignKey
ALTER TABLE "ClientNote" ADD CONSTRAINT "ClientNote_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE SET NULL ON UPDATE CASCADE;
