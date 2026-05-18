import z from "zod";
import { createTRPCRouter, orgProcedure } from "../init";
import prisma from "@/lib/prisma";
import { QueryMode } from "@/generated/prisma/internal/prismaNamespace";


export const jobsRouter=createTRPCRouter({
    getJobs:orgProcedure.input(
        z.object({
            query: z.string().trim().optional(),
          })
          .optional(),
      ).query(async ({ ctx, input }) => {
        const now = new Date();
        const searchString = input?.query;
        const baseWhere = {
            orgId: ctx.orgId,
            ...(searchString && {
                OR: [
                    { title: { contains: searchString, mode: QueryMode.insensitive } },
                    { companyName: { contains: searchString, mode: QueryMode.insensitive } },
                    { skillsRequired: { hasSome: [searchString.toLowerCase()] } },
                  ],
            }),
          };
          const [upcoming, active, ended] = await prisma.$transaction([
           prisma.job.findMany({
              where: { ...baseWhere, createdAt: { gt: now } },
              orderBy: { createdAt: "asc" },
            }),
            prisma.job.findMany({
              where: { ...baseWhere, createdAt: { lte: now }, deadline: { gt: now } },
              orderBy: { deadline: "asc" },
            }),
            prisma.job.findMany({
              where: { ...baseWhere, deadline: { lte: now } },
              orderBy: { deadline: "desc" },
            }),
          
          ]);
          
          return { upcoming, active, ended };
      }),

})
