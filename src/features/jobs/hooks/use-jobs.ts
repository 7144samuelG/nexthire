import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useJobsParams } from "./use-jobs-params";
export const useSuspenseJobs=()=>{
    const trpc=useTRPC();
    const[params]=useJobsParams()

    return useSuspenseQuery(trpc.jobs.getMany.queryOptions(params))
}
export const useCreateNewJob=()=>{
    const trpc=useTRPC();
    
    const queryClient=useQueryClient();
    return useMutation(
        trpc.jobs.create.mutationOptions({
            onSuccess:(data)=>{
                toast.success(`workflow ${data.title} created`);
                queryClient.invalidateQueries(
                    trpc.jobs.getMany.queryOptions({})
                )
            },
            onError:(error)=>{
                toast.error(`failed to create job ${error.message}`)
            }
        })
    )
}