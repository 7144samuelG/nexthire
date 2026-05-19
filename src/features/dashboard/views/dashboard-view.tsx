// import { PageHeader } from "@/components/page-header";
// import { DashboardHeader } from "../components/dashboard-header";
import { JobStatsCards } from "../components/dashboard-jobs";

export function DashboardView() {
    return (
      <div className="relative">
        {/* <PageHeader title="Dashboard" className="lg:hidden" /> */}
        <div className="relative space-y-8 px-4 pb-4 lg:pb-16 pt-4 lg:px-16">
        {/* <DashboardHeader /> */}
        <JobStatsCards/>
      </div>
      </div>
    );
  };