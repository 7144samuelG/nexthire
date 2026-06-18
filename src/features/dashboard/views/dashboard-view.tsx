// import { PageHeader } from "@/components/page-header";
// import { DashboardHeader } from "../components/dashboard-header";
"use client";
import { useRouter } from "next/navigation";
import JobsDashboard from "../components/dashboard-job-listings";
import { useSuspenseJobs } from "../hooks/use-jobs";
// import { EmptyView } from "@/components/empty-view";
// import { JobStatsCards } from "../components/dashboard-jobs";

export function DashboardView() {
  const router = useRouter();
  const jobs=useSuspenseJobs()
  return (
    <div className="relative">
      {/* <PageHeader title="Dashboard" className="lg:hidden" /> */}
       <div className="relative space-y-8 px-4 pb-4 lg:pb-16 pt-4 lg:px-16">
        
        
         <JobsDashboard
      onViewJob={(job) => router.push(`/jobs/${job.id}`)}
      onViewAll={() => router.push("/jobs")}
      totalJobs={jobs.data?.count ?? 0}
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
