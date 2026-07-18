import { JobsError } from "@/features/dashboard/components/jobs-error-loading";
import { JobsLoading } from "@/features/dashboard/components/jobsloading";
import { ExploreJobsView } from "@/features/explore/views/explore-Jobs-views";
import { JobsParamsLoader } from "@/features/server/params-loder";
import { prefetchJobs } from "@/features/server/prefetch";
import { HydrateClient } from "@/trpc/server";
import { Metadata } from "next";
import type { SearchParams } from "nuqs/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export const metadata: Metadata= { title: "Explore My Jobs" };
type Props = {
  searchParams: Promise<SearchParams>;
};


const MyJobs = async({searchParams}:Props) => {
  const params=await JobsParamsLoader(searchParams);
  prefetchJobs(params);
    return (
        <HydrateClient>
          <ErrorBoundary fallback={<JobsError/>}>
            <Suspense fallback={<JobsLoading/>}>
            <ExploreJobsView/>
            </Suspense>
          </ErrorBoundary>
        </HydrateClient>
      );
}
 
export default MyJobs;