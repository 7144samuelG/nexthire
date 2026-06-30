"use client";
import JobsDashboard from "../components/dashboard-job-listings";
import { useSuspenseJobs } from "../hooks/use-jobs";
import { Job } from "@/generated/prisma/client";
import { JobItems } from "../components/job-item";
import { formatDistanceToNow } from "date-fns";
import { deriveStatus } from "../components/derive-status";

export function DashboardView() {
  const jobs = useSuspenseJobs();
  return (
    <div className="relative">
      <div className="relative space-y-8 px-4 pb-4 lg:pb-16 pt-4 lg:px-16">
        <JobsDashboard
          getKey={(job) => job.id}
          renderItems={(job) => <JobItem data={job} />}
          totalJobs={jobs.data?.count ?? 0}
          jobs={jobs.data.items}
          active={jobs.data.active}
          ended={jobs.data.ended}
        />
      </div>
    </div>
  );
}
export const JobItem = ({ data }: { data: Job }) => {
  const status = deriveStatus(data.deadline);
  return (
    <JobItems
      href={`/jobs/${data.id}`}
      title={data.title}
      subtitle={<>CreatedAt {formatDistanceToNow(data.createdAt)}</>}
      status={status}
    />
  );
};
