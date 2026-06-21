-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "isAvailable" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Provider" ALTER COLUMN "tagline" DROP NOT NULL;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "deliveryAddress" TEXT;
