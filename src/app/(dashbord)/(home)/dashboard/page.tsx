import { JobsContainer, Jobslist } from "@/features/jobs/components/jobs";
import { JobsParamsLoader } from "@/features/jobs/server/params-loader";
import { prefetchJobs } from "@/features/jobs/server/prefetch";
import { requireauth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";
import type { SearchParams } from "nuqs";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

type Props = {
  searchParams: Promise<SearchParams>;
};

const Dashboard = async ({ searchParams }: Props) => {
  await requireauth();

  const params = await JobsParamsLoader(searchParams);
  prefetchJobs(params);

  return (
    <JobsContainer>
      <HydrateClient>
        <ErrorBoundary fallback={<div>Something went wrong</div>}>
          <Suspense fallback={<div>Loading...</div>}>
            <Jobslist />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </JobsContainer>
  );
};

export default Dashboard;
