 "use client"

import { useSuspenseJobs } from "@/features/dashboard/hooks/use-jobs";
import { ExploreDashboard } from "../components/explore-dashboard";
import { Job } from "@/generated/prisma/client";
import { deriveStatus } from "@/features/dashboard/components/derive-status";
import { JobCard } from "../components/job-card";
 export const ExploreJobsView = () => {
    const jobs=useSuspenseJobs();
    
    return ( 
        <div>
            <ExploreDashboard
             getKey={(job) => job.id}
             renderItems={(job) => <JobItem data={job} />}
             totaljobs={jobs.data?.count ?? 0}
             active={jobs.data.active}
             ended={jobs.data.ended}
             jobs={jobs.data.items}
            />
        </div>
    );
 }
 export const JobItem = ({ data }: { data: Job }) => {
   const status = deriveStatus(data.deadline);
   return (
     <JobCard
       jobid={data.id} 
       title={data.title}
       status={status}
       location={data.location}
       workMode={data.workMode}
       salaryMin={data.salaryMin}
       salaryMax={data.salaryMax}
       currency={data.currency}
     />
   );
 };
 