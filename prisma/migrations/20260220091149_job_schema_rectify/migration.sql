/*
  Warnings:

  - Added the required column `category` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companyName` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `salaryMax` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `salaryMin` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Made the column `requirements` on table `Job` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "companyName" TEXT NOT NULL,
ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'USD',
ADD COLUMN     "deadline" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "remote" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "salaryMax" INTEGER NOT NULL,
ADD COLUMN     "salaryMin" INTEGER NOT NULL,
ALTER COLUMN "requirements" SET NOT NULL;
