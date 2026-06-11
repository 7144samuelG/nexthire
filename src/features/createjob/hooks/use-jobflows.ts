import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useCreateNewJob=()=>{
    const trpc=useTRPC();
    
    const queryClient=useQueryClient();
    return useMutation(
        trpc.jobs.newJob.mutationOptions({
            onSuccess:(data)=>{
                toast.success(` New job ${data.job.title} created`);
                queryClient.invalidateQueries(
                    // trpc.jobs.getJobs.queryOptions({})
                )
            },
            onError:(error)=>{
                toast.error(`failed to create newjob ${error.message}`)
            }
        })
    )
}
