import { AddJobCard } from "./add-job-card";

interface ExploreDashboardProps<T> {
  renderItems: (item: T, index: number) => React.ReactNode;
  getKey?: (item: T, index: number) => string | number;
  totaljobs: number;
  active: number;
  ended: number;
  jobs: T[];
}
export function ExploreDashboard<T>({
  getKey,
  renderItems,
  totaljobs,
  active,
  ended,
  jobs,
}: ExploreDashboardProps<T>) {
  const today = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  if (jobs.length === 0) {
    return (
      <div
        style={{
          background: "#F3F4F6",
          minHeight: "100vh",
          padding: "32px 24px",
          fontFamily: "inherit",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginBottom: 24,
          }}
        >
          <div>
            <h1
              style={{
                fontSize: 18,
                fontWeight: 500,
                color: "#111827",
                margin: 0,
              }}
            >
              Jobs overview
            </h1>
            <p
              style={{
                fontSize: 12,
                color: "#9CA3AF",
                marginTop: 4,
                marginBottom: 0,
              }}
            >
              Track and manage all your job postings
            </p>
          </div>
          <span style={{ fontSize: 12, color: "#9CA3AF" }}>{today}</span>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="max-w-sm mx-auto">
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <AddJobCard />
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-(--nh-paper)">
      <div className="mx-auto  px-4 py-10 sm:px-6">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p
              className="text-[13px] font-semibold uppercase tracking-wider text-(--nh-ink-soft)"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              NextHire · Hire Smarter
            </p>
            <h1
              className="mt-1 text-3xl font-bold text-(--nh-ink) sm:text-4xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Explore your jobs
            </h1>
          </div>

          <dl className="flex gap-6" style={{ fontFamily: "var(--font-mono)" }}>
            <div>
              <dt className="text-[11px] uppercase tracking-wider text-(--nh-ink-soft)">
                Active
              </dt>
              <dd className="text-xl font-semibold text-(--nh-active)">
                {active}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-wider text-(--nh-ink-soft)">
                Ended
              </dt>
              <dd className="text-xl font-semibold text-(--nh-closing)">
                {ended}
              </dd>
            </div>
          </dl>
        </header>
      </div>
      <div className="">
        <div>

        <div className="">
          <div>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {
            totaljobs> 0 ? (
              jobs.map((job, index) => (
                <div
                  key={getKey ? getKey(job, index) : index}
                >
                  
                  {renderItems(job, index)}
                </div>
              ))
            ):( 
              <div
              style={{
                padding: "36px 14px",
                textAlign: "center",
                fontSize: 13,
                color: "#9CA3AF",
              }}
            >
              No jobs match your search.
            </div>
            )
          }
             
            </div>
          </div>
        </div>
         
        </div>
       
      </div>
    </div>
  );
}
