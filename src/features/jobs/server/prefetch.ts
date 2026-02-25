import type {inferInput} from "@trpc/tanstack-react-query";
import { trpc, prefetch } from "@/trpc/server";

type inputs=inferInput<typeof trpc.jobs.getMany>;

export const prefetchJobs=(input:inputs)=>{
    return prefetch(trpc.jobs.getMany.queryOptions(input));
}