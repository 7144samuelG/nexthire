export type JobStatus = "active" | "ended";
export const statusTokens: Record<JobStatus, { fg: string; bg: string; dot: string }> = {
    active: { fg: "var(--nh-active)", bg: "var(--nh-active-soft)", dot: "var(--nh-active)" },
    ended: { fg: "var(--nh-ended)", bg: "var(--nh-ended-soft)", dot: "var(--nh-ended)" },
  };