import type {inferInput} from "@trpc/tanstack-react-query";
import { trpc, prefetch } from "@/trpc/server";

type inputs=inferInput<typeof trpc.jobs.getJobs>;

export const prefetchJobs=(input:inputs)=>{
    return prefetch(trpc.jobs.getJobs.queryOptions(input));
};

// export const prefetchWorkflow=(id:string)=>{
//     return prefetch(trpc.workflows.getOne.queryOptions({id}))
// }