import z from "zod";
import { createTRPCRouter, orgProcedure } from "../init";
import prisma from "@/lib/prisma";
import { QueryMode } from "@/generated/prisma/internal/prismaNamespace";
import { TRPCError } from "@trpc/server";

export const jobsRouter = createTRPCRouter({
  getJobs: orgProcedure
    .input(
      z
        .object({
          query: z.string().trim().optional(),
          page: z.number().int().min(1).default(1),
          pageSize: z.number().int().min(1).max(100).default(20),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const now = new Date();
      const searchString = input?.query;
      const page = input?.page ?? 1;
      const pageSize = 7;
      const skip = (page - 1) * pageSize;

      const baseWhere = {
        orgId: ctx.orgId,
        ...(searchString && {
          OR: [
            { title: { contains: searchString, mode: QueryMode.insensitive } },
            {
              companyName: {
                contains: searchString,
                mode: QueryMode.insensitive,
              },
            },
            { skillsRequired: { hasSome: [searchString.toLowerCase()] } },
          ],
        }),
      };
      const [upcoming, active, ended, paginated] = await prisma.$transaction([
        prisma.job.findMany({
          where: { ...baseWhere, createdAt: { gt: now } },
          orderBy: { createdAt: "asc" },
        }),
        prisma.job.findMany({
          where: {
            ...baseWhere,
            createdAt: { lte: now },
            deadline: { gt: now },
          },
          orderBy: { deadline: "asc" },
        }),
        prisma.job.findMany({
          where: { ...baseWhere, deadline: { lte: now } },
          orderBy: { deadline: "desc" },
        }),
        prisma.job.findMany({
          where: baseWhere,
          orderBy: { createdAt: "desc" }, // newest first
          skip,
          take: pageSize,
        }),
      ]);

      return { upcoming, active, ended, paginated };
    }),

    //create job
    newJob: orgProcedure
    .input(
      z.object({
        // Basic info
        title:          z.string().min(5).max(255),
        companyName:    z.string().min(1).max(255),
        description:    z.string().min(1),
 
        // Logistics
        location:       z.string().min(1).max(255),
        workMode:       z.enum(["REMOTE", "HYBRID", "OFFSITE"]).default("OFFSITE"),
        employmentType: z.enum(["Full-time", "Part-time", "Contract", "Internship", "Freelance"]),
 
        // Compensation (optional)
        salaryMin:      z.number().int().positive().optional(),
        salaryMax:      z.number().int().positive().optional(),
        currency:       z.string().length(3).default("USD"),
 
        // AI-ready fields
        skillsRequired: z.array(z.string().min(1).max(255)).min(1),
        requirements:   z.string().min(1),
        deadline:       z.date().optional()
      })
      // Ensure salaryMax >= salaryMin when both are provided
      .refine(
        (data) =>
          data.salaryMin === undefined ||
          data.salaryMax === undefined ||
          data.salaryMax >= data.salaryMin,
        {
          message: "salaryMax must be greater than or equal to salaryMin",
          path: ["salaryMax"],
        }
      )
    )
    .mutation(async ({ ctx, input }) => {
      const orgId = ctx.orgId; 
 
      // 2. Guard: deadline must be in the future
      if (input.deadline && input.deadline <= new Date()) {
        throw new TRPCError({
          code:    "BAD_REQUEST",
          message: "Deadline must be a future date.",
        });
      }
 
      // 3. Create the job
      const job = await prisma.job.create({
        data: {
          title:          input.title,
          companyName:    input.companyName,
          description:    input.description,
          location:       input.location,
          workMode:       input.workMode,
          employmentType: input.employmentType,
          salaryMin:      input.salaryMin   ?? null,
          salaryMax:      input.salaryMax   ?? null,
          currency:       input.currency,
          skillsRequired: input.skillsRequired,
          requirements:   input.requirements,
         
          formSlug:       ctx.orgId + "-" + Date.now(), // simple unique slug generation
          orgId,
        },
      });
 
      return {
        success: true,
        job,
        applyUrl: `https://nexthire.com/apply/${job.formSlug}`,
      };
    }),
});
