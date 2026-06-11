-- DropIndex
DROP INDEX "Job_orgId_createdAt_deadline_idx";

-- AlterTable
ALTER TABLE "Job" ALTER COLUMN "deadline" DROP NOT NULL,
ALTER COLUMN "deadline" DROP DEFAULT;

-- CreateIndex
CREATE INDEX "Job_orgId_createdAt_idx" ON "Job"("orgId", "createdAt");
