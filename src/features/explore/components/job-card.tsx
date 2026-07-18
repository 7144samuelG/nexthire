import { statusTokens } from "@/features/server/status";
import { WorkMode } from "@/generated/prisma/enums";
import Link from "next/link";
interface JobCardData {
  jobid: string;
  title: string;
  location: string;
  workMode: WorkMode | null;
  salaryMin: string;
  salaryMax: string;
  currency:string;
  status:"active"|"ended";
}



export function JobCard({ jobid,title,location,workMode,salaryMax,salaryMin,currency,status}: JobCardData) {
  const tokens = statusTokens[status];

  return (
    <Link
      href={`/jobs/${jobid}`}
      className={`group flex flex-col rounded-2xl bg-(--nh-card) border border-(--nh-line) shadow-[0_1px_0_rgba(20,23,31,0.03)] transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(20,23,31,0.08)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--nh-ink) ${
        status=="ended" ? "opacity-60 grayscale-[0.3]" : ""
      }`}
    >
      {/* Info panel */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-semibold text-(--nh-card)"
            style={{ background: "var(--nh-ink)", fontFamily: "var(--font-display)" }}
            aria-hidden
          >
            {title.slice(0, 2).toUpperCase()}
          </div>
          <span
            className="rounded-full px-2.5 py-1 text-[11px] font-medium tracking-wide"
            style={{ background: "var(--nh-paper)", color: "var(--nh-ink-soft)" }}
          >
            {workMode}
          </span>
        </div>

        <div>
          <h3
            className="text-[17px] font-semibold leading-snug text-(--nh-ink) group-hover:underline decoration-(--nh-line) underline-offset-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {title}
          </h3>
          <p className="mt-1 text-sm text-(--nh-ink-soft)">
           {location}
          </p>
        </div>

       
          <p
            className="text-sm font-medium text-(--nh-ink)"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {` ${currency} ${salaryMin} – ${salaryMax}`}
          </p>
      
      </div>

      {/* Boarding-pass stub: perforated status readout */}
      <div className="nh-perforation flex items-center justify-between px-5 py-3">
        <span
          className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-wider"
          style={{ fontFamily: "var(--font-mono)", color: tokens.fg }}
        >
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: tokens.dot }}
            aria-hidden
          />
          {title}
        </span>
        <span
          className="rounded-md px-2 py-0.5 text-[11px] font-semibold"
          style={{ background: tokens.bg, color: tokens.fg, fontFamily: "var(--font-mono)" }}
        >
          {status === "ended" ? "ENDED" : "ACTIVE"}
        </span>
      </div>
    </Link>
  );
}