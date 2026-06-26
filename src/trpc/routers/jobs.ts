import z from "zod";
import { createTRPCRouter, orgProcedure } from "../init";
//import prisma from "@/lib/prisma";

import prisma from "@/lib/prisma";
import { PAGINATION } from "@/features/server/constants";

export const jobsRouter = createTRPCRouter({
  getJobs: orgProcedure
    .input(
      z.object({
        page:z.number().default(PAGINATION.DEFAULT_PAGE),
        page_size:z.number().min(PAGINATION.MIN_PAGE_SIZE).max(PAGINATION.MAX_PAGE_SIZE).default(PAGINATION.DEFAULT_PAGE_SIZE),
        search:z.string().default("")        
    })
).query(async ({ ctx, input }) => {
    const now = new Date();
  const{page,page_size,search}=input;

      const[items,count,ended,active]=await Promise.all([
        prisma.job.findMany({
          skip:(page-1)*page_size,
                take:page_size,
                where:{
                    orgId:ctx.orgId,
                    title:{
                        contains:search,
                        mode:"insensitive"
                    }
                },
                orderBy:{
                    createdAt:"desc"
                }
        }),
        prisma.job.count({
          where:{
              orgId:ctx.orgId,
          }
      }),
      prisma.job.count({
        where:{
            orgId:ctx.orgId,
            deadline:{
                lte:now
            }
        } }),

        prisma.job.count({
          where: {
            orgId:ctx.orgId,
            createdAt: { lte: now },
            deadline: { gt: now },
          },
          orderBy: { deadline: "asc" },
        }),
      ])
      const totalpages=Math.ceil(count/page_size);
      const hasNextPage=page<totalpages;
      const hasPreviousPage=page>1;
     return {
         totalpages,
         hasNextPage,
         hasPreviousPage,
         items:items,
         count,
         page_size,
         page,
         ended,
         active
     }
  
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
         salaryMin:     z.string().default("0"),
         salaryMax:     z.string().default("5000"),
        currency:       z.string().length(3).default("USD"),
 
        // AI-ready fields
        skillsRequired: z.array(z.string().min(1).max(255)).min(1),
        requirements:   z.string().min(1),
        deadline:        z.string()
        .min(1, "Deadline is required")
        .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date format" })
        .transform((val) => new Date(val)),
      })
     
    )
    .mutation(async ({ ctx, input }) => {
      const orgId = ctx.orgId; 
 
   
      const job = await prisma.job.create({
        data: {
          title:          input.title,
          companyName:    input.companyName,
          description:    input.description,
          location:       input.location,
          workMode:       input.workMode,
          employmentType: input.employmentType,
          salaryMin:      input.salaryMin,
          salaryMax:      input.salaryMax,
          currency:       input.currency,
          skillsRequired: input.skillsRequired,
          requirements:   input.requirements,
          deadline:       input.deadline,
          orgId:orgId.toString(),
          formSlug:       `apply at ${ctx.orgId.toString()} + "-" + ${Date.now().toString()}`, // simple unique slug generation
        
        },
      }).catch((e) => {
        console.error("Prisma error:", JSON.stringify(e, null, 2));
        throw e;
      });;
 
      return {
        success: true,
        job,
        applyUrl: `https://nexthire.com/apply/${job.formSlug}`,
      };
    }),
});
