-- DropForeignKey
ALTER TABLE "public"."ClientCategory" DROP CONSTRAINT "ClientCategory_userId_fkey";

-- AlterTable
ALTER TABLE "public"."ClientCategory" ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."ClientCategory" ADD CONSTRAINT "ClientCategory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
