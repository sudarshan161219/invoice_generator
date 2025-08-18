-- CreateEnum
CREATE TYPE "public"."Currency" AS ENUM ('USD', 'EUR', 'INR', 'GBP');

-- CreateEnum
CREATE TYPE "public"."PaymentTerms" AS ENUM ('net15', 'net30', 'net45', 'dueOnReceipt');

-- CreateEnum
CREATE TYPE "public"."ClientStatus" AS ENUM ('active', 'inactive', 'prospect');

-- CreateEnum
CREATE TYPE "public"."ClientCategoryEnum" AS ENUM ('retail', 'wholesale', 'corporate');

-- AlterTable
ALTER TABLE "public"."Client" ADD COLUMN     "billingAddress" TEXT,
ADD COLUMN     "categoryType" "public"."ClientCategoryEnum",
ADD COLUMN     "currency" "public"."Currency",
ADD COLUMN     "paymentTerms" "public"."PaymentTerms",
ADD COLUMN     "shippingAddress" TEXT,
ADD COLUMN     "status" "public"."ClientStatus",
ADD COLUMN     "website" TEXT;
