/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `ClientTag` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ClientTag_name_key" ON "public"."ClientTag"("name");
