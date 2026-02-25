"use client"

import { useRouter } from "next/navigation";
import { useCreateNewJob, useSuspenseJobs } from "../hooks/use-jobs";
import { Container, EntityPagination, EntitySearch, Header } from "@/components/jobs-entity";
import { useJobsParams } from "../hooks/use-jobs-params";
import { useEntitySearch } from "@/hooks/use-entity-search";

export const Jobslist = () => {
  const jobs = useSuspenseJobs();
  console.log(jobs,"jobs")

  return <div >{JSON.stringify(jobs, null, 2)}</div>;
};

export const JobsHeader = ({ disabled }: { disabled?: boolean }) => {
  const router = useRouter();
  const createNewJob = useCreateNewJob();
//   const { modal, handleError } = useUpgradeModel();

  const handleCreate = () => {
    createNewJob.mutate(undefined, {
      onSuccess: (data) => {
        router.push(`/jobs/${data.id}`);
      },
      onError: (error) => {
        alert(error);
      },
    });
  };
  return (
    <>
      {/* {modal} */}
      <Header
        title="new workflows"
        description="create and manage new workflows"
        onNew={handleCreate}
        newButtonLabel="New Workflow"
        disabled={disabled}
        isCreating={createNewJob.isPending}
      />
    </>
  );
};
export const JobsSearch = () => {
  const [params, setParams] = useJobsParams();
  const { onSearchChange, searchValue } = useEntitySearch({
    params,
    setParams,
  });
  return (
    <EntitySearch
      value={searchValue}
      placeholder="search workflows"
      onChange={onSearchChange}
    />
  );
};


export const JobsPagination = () => {
  const jobs = useSuspenseJobs();
  const [params, setParams] = useJobsParams();
  return (
    <EntityPagination
      disabled={jobs.isFetching}
      totalpages={jobs.data.totalpages}
      page={jobs.data.page}
      onPageChange={(page) => setParams({ ...params, page })}
    />
  );
};
export const JobsContainer = ({
    children,
  }: {
    children: React.ReactNode;
  }) => {
    return (
      <Container
        header={<JobsHeader />}
        search={<JobsSearch/>}
        pagination={<JobsPagination/>}
      >
        {children}
      </Container>
    );
  };