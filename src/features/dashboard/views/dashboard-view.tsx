// import { PageHeader } from "@/components/page-header";
// import { DashboardHeader } from "../components/dashboard-header";
"use client"
import { useRouter } from "next/navigation";
import JobsDashboard from "../components/dashboard-job-listings";
//import { JobStatsCards } from "../components/dashboard-jobs";

export function DashboardView() {
  const router=useRouter();
    return (
      <div className="relative">
        {/* <PageHeader title="Dashboard" className="lg:hidden" /> */}
        <div className="relative space-y-8 px-4 pb-4 lg:pb-16 pt-4 lg:px-16">
        {/* <DashboardHeader /> */}
        {/* <JobStatsCards/> */}
        <JobsDashboard
      onViewJob={(job) => router.push(`/jobs/${job.id}`)}
      onViewAll={() => router.push("/jobs")}
      totalJobs={28}
    />
      </div>
      </div>
    );
  };