-- CreateEnum
CREATE TYPE "userStatus" AS ENUM ('ACTIVATE', 'SUSPENDE');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "status" "userStatus" NOT NULL DEFAULT 'ACTIVATE';
