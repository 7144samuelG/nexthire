// import { PageHeader } from "@/components/page-header";
// import { DashboardHeader } from "../components/dashboard-header";
"use client";
//import { useRouter } from "next/navigation";
import JobsDashboard from "../components/dashboard-job-listings";
import { useSuspenseJobs } from "../hooks/use-jobs";
import { Job } from "@/generated/prisma/client";
import { JobItems } from "../components/job-item";
import { formatDistanceToNow } from "date-fns";
// import { EmptyView } from "@/components/empty-view";
// import { JobStatsCards } from "../components/dashboard-jobs";

export function DashboardView() {
  // const router = useRouter();
  const jobs=useSuspenseJobs()
  return (
    <div className="relative">
      {/* <PageHeader title="Dashboard" className="lg:hidden" /> */}
       <div className="relative space-y-8 px-4 pb-4 lg:pb-16 pt-4 lg:px-16">
        
        
         <JobsDashboard
      // onViewJob={(job) => router.push(`/jobs/${job.id}`)}
      // onViewAll={() => router.push("/jobs")}
      getKey={(job)=>job.id}
      renderItems={(job)=><JobItem data={job}/>}
      totalJobs={jobs.data?.count ?? 0}
      jobs={jobs.data.items}
    /> 
        </div> 
      {/* <div className="flex h-screen  items-center justify-center ">
        <EmptyView
          message="No Jobs yet"
          onNew={() => router.push("/jobs/new")}
        />
      </div> */}
    </div>
  );
}
export const JobItem=({data}:{data:Job})=>{
  // const removeWorkFlow=useRemoveWorkFlow();
  // const handleRemove=()=>{
  //   removeWorkFlow.mutate({id:data.id})
  // }
  return(
    <JobItems
     href={`/jobs/${data.id}`}
     title={data.title}
     subtitle={
      <>
     Created{" "} CreatedAt {formatDistanceToNow(data.createdAt)}
      </>
     }
    //  image={
    //   <div className="flex items-center justify-center size-8">
    //     <WorkflowIcon className="size-5 text-m,uted-foreground"/>
    //   </div>
    //  }
    //  onRemove={handleRemove}
    //  isRemoving={removeWorkFlow.isPending}
    />
  )
}