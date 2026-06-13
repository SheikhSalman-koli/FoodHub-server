/*
  Warnings:

  - You are about to alter the column `discount` on the `OrderItem` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Meal" ADD COLUMN     "discount" INTEGER DEFAULT 0;

-- AlterTable
ALTER TABLE "OrderItem" ALTER COLUMN "discount" SET DEFAULT 0,
ALTER COLUMN "discount" SET DATA TYPE INTEGER;
