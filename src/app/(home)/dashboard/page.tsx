import { DashboardView } from "@/features/dashboard/views/dashboard-view";
import { JobsParamsLoader } from "@/features/server/params-loder";
import { prefetchJobs } from "@/features/server/prefetch";
import { HydrateClient } from "@/trpc/server";
import { Metadata } from "next";
import { ErrorBoundary } from "react-error-boundary";
import type { SearchParams } from "nuqs/server";
import { Suspense } from "react";
import { JobsError } from "@/features/dashboard/components/jobs-error-loading";
import { JobsLoading } from "@/features/dashboard/components/jobsloading";

export const metadata: Metadata = { title: "dashboard" };
type Props = {
  searchParams: Promise<SearchParams>;
};

const Dashboard = async ({ searchParams }: Props) => {
  const page = 1;
  const params = await JobsParamsLoader(searchParams);
  prefetchJobs(params);
  return (
    <HydrateClient>
      <ErrorBoundary fallback={<JobsError />}>
        <Suspense fallback={<JobsLoading />}>
          <DashboardView />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
};

export default Dashboard;
