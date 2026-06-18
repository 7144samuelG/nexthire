import { useTRPC } from "@/trpc/client";
import { useJobsParms } from "./use-jobs-params";
import { useSuspenseQuery } from "@tanstack/react-query";

export const useSuspenseJobs=()=>{
    const trpc=useTRPC();
    const[params]=useJobsParms()

    return useSuspenseQuery(trpc.jobs.getJobs.queryOptions(params))
}