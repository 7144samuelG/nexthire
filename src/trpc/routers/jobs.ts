import z from "zod";
import { createTRPCRouter, orgProcedure } from "../init";
import prisma from "@/lib/prisma";
import { QueryMode } from "@/generated/prisma/internal/prismaNamespace";

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
});
