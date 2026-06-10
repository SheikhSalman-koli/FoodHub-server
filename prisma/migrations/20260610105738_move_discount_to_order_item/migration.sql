/*
  Warnings:

  - You are about to drop the column `discount` on the `Order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "discount";

-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "discount" DECIMAL(65,30) DEFAULT 0;
