/*
  Warnings:

  - You are about to drop the `_ClientCategoryToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."_ClientCategoryToUser" DROP CONSTRAINT "_ClientCategoryToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_ClientCategoryToUser" DROP CONSTRAINT "_ClientCategoryToUser_B_fkey";

-- DropTable
DROP TABLE "public"."_ClientCategoryToUser";

-- AddForeignKey
ALTER TABLE "public"."ClientCategory" ADD CONSTRAINT "ClientCategory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
