-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('OPEN', 'CLOSED', 'PAUSED', 'EXTENDED');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('RECEIVED', 'SHORTLISTED', 'REJECTED', 'INTERVIEW', 'HIRED');

-- CreateEnum
CREATE TYPE "AIRecommendation" AS ENUM ('STRONGLY_RECOMMENDED', 'RECOMMENDED', 'NEUTRAL', 'NOT_RECOMMENDED');

-- CreateEnum
CREATE TYPE "TeamRole" AS ENUM ('ADMIN', 'RECRUITER', 'HR_MANAGER');

-- CreateEnum
CREATE TYPE "InterviewStatus" AS ENUM ('SCHEDULED', 'COMPLETED', 'CANCELED');

-- CreateTable
CREATE TABLE "EmployerProfile" (
    "id" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "logoUrl" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmployerProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Job" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "requirements" TEXT,
    "aiEnabled" BOOLEAN NOT NULL DEFAULT true,
    "userId" TEXT NOT NULL,
    "status" "JobStatus" NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Application" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "linkedinUrl" TEXT,
    "portfolioUrl" TEXT,
    "userSelfDescription" TEXT NOT NULL,
    "resumeUrl" TEXT NOT NULL,
    "audioIntroUrl" TEXT,
    "aiScore" DOUBLE PRECISION,
    "aiSummary" TEXT,
    "aiKeywords" TEXT[],
    "aiRecommendation" "AIRecommendation",
    "jobId" TEXT NOT NULL,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'RECEIVED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AIAnalysis" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "resumeScore" DOUBLE PRECISION,
    "audioScore" DOUBLE PRECISION,
    "cultureFitScore" DOUBLE PRECISION,
    "experienceScore" DOUBLE PRECISION,
    "extractedSkills" TEXT[],
    "detectedTone" TEXT,
    "riskFlags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AIAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamMember" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "TeamRole" NOT NULL,
    "userId" TEXT NOT NULL,
    "employerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TeamMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Note" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Note_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScheduledInterview" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "location" TEXT,
    "interviewType" TEXT NOT NULL,
    "status" "InterviewStatus" NOT NULL DEFAULT 'SCHEDULED',
    "candidateId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScheduledInterview_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EmployerProfile_email_key" ON "EmployerProfile"("email");

-- CreateIndex
CREATE UNIQUE INDEX "EmployerProfile_userId_key" ON "EmployerProfile"("userId");

-- CreateIndex
CREATE INDEX "Application_jobId_idx" ON "Application"("jobId");

-- CreateIndex
CREATE INDEX "Application_aiScore_idx" ON "Application"("aiScore");

-- CreateIndex
CREATE UNIQUE INDEX "AIAnalysis_applicationId_key" ON "AIAnalysis"("applicationId");

-- CreateIndex
CREATE UNIQUE INDEX "TeamMember_email_key" ON "TeamMember"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ScheduledInterview_candidateId_key" ON "ScheduledInterview"("candidateId");

-- AddForeignKey
ALTER TABLE "EmployerProfile" ADD CONSTRAINT "EmployerProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIAnalysis" ADD CONSTRAINT "AIAnalysis_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_employerId_fkey" FOREIGN KEY ("employerId") REFERENCES "EmployerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduledInterview" ADD CONSTRAINT "ScheduledInterview_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;
