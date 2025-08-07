-- DropForeignKey
ALTER TABLE "ClientNote" DROP CONSTRAINT "ClientNote_clientId_fkey";

-- AlterTable
ALTER TABLE "ClientNote" ALTER COLUMN "clientId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "ClientNote" ADD CONSTRAINT "ClientNote_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;
