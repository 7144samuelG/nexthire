import { PAGINATION } from "@/config/constants";
import { prisma } from "@/lib/prisma";
import { createTRPCRouter, protectedProcedures } from "@/trpc/init";
import z from "zod";

export const jobsRouter = createTRPCRouter({
  create: protectedProcedures
    // .input(
    //   z.object({
    //     title: z.string().min(5).max(100),
    //     description: z.string().max(500),
    //     requirements: z.string().min(30).max(500),
    //     aiEnabled: z.boolean().default(true),
    //     salarymin: z.number(),
    //     salarymax: z.number(),
    //     currency: z.string(),
    //     location: z.string().optional(),
    //     companyname: z.string(),
    //     remote: z.boolean(),
    //     category: z.string(),
    //     deadline: z.date(),
    //   })
    //)
    .mutation(({ ctx }) => {
      return prisma.job.create({
        data: {
          title: "junior devrel",
          description: "most dg",
          requirements: "jfjjfjjf",
          aiEnabled: true,
          userId: ctx.auth.user.id,
          salaryMax: 41414,
          salaryMin: 55,
          currency: "USD",
          location: "KENYA",
          companyName: "GOOGLE KENYA",
          remote: false,
          category: "enginneering",
        },
      });
    }),
  getMany: protectedProcedures
  .input(
    z.object({
        page:z.number().default(PAGINATION.DEFAULT_PAGE),
        page_size:z.number().min(PAGINATION.MIN_PAGE_SIZE).max(PAGINATION.MAX_PAGE_SIZE).default(PAGINATION.DEFAULT_PAGE_SIZE),
        search:z.string().default("")        
    })
)
  .query(async ({ ctx ,input}) => {
    const{page,page_size,search}=input;
    const [items,count] = await Promise.all([
      prisma.job.findMany({
           skip:(page-1)*page_size,
           take:page_size,
        where: {
          userId: ctx.auth.user.id,
             title:{
                 contains:search,
                 mode:"insensitive"
             }
        },
        orderBy: {
          updatedAt: "desc",
        },
      }),
         prisma.job.count({
             where:{
                 userId:ctx.auth.user.id,
             }
         })
    ]);
    const totalpages=Math.ceil(count/page_size);
    const hasNextPage=page<totalpages;
    const hasPreviousPage=page>1;
    return {
         totalpages,
         hasNextPage,
         hasPreviousPage,
      items: items,
         count,
         page_size,
         page
    };
  }),
});
