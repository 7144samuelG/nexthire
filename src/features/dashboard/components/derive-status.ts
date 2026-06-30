export type JobStatus = "active" | "ended";

export function deriveStatus(deadline: Date | string): JobStatus {
  const deadlineDate = typeof deadline === "string" ? new Date(deadline) : deadline;
  return deadlineDate.getTime() < Date.now() ? "ended" : "active";
}