-- DropIndex
DROP INDEX "Meal_providerId_key";

-- AlterTable
ALTER TABLE "Meal" ADD COLUMN     "image" TEXT,
ALTER COLUMN "price" SET DATA TYPE DECIMAL(65,30);
