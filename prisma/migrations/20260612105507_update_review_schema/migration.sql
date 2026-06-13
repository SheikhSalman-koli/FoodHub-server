/*
  Warnings:

  - You are about to alter the column `starCount` on the `Review` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.
  - A unique constraint covering the columns `[userId,orderId,mealId]` on the table `Review` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `orderId` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "orderId" TEXT NOT NULL,
ALTER COLUMN "starCount" SET DATA TYPE INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Review_userId_orderId_mealId_key" ON "Review"("userId", "orderId", "mealId");

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
