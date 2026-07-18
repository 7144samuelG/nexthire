import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export function AddJobCard() {
    const router=useRouter();
  return (
    <button
      type="button"
      onClick={()=>router.push("/new-job")}
      className="group flex min-h-220 flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-(--nh-line) bg-transparent p-5 text-center transition-colors hover:border-(--nh-ink) hover:bg-(--nh-card)  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--nh-ink)"
   >
      <span
        className="flex h-11 w-11 items-center justify-center rounded-full border border-(--nh-line) text-(--nh-ink) transition-colors group-hover:border-(--nh-ink) group-hover:bg-(--nh-ink) group-hover:text-(--nh-card)"
        aria-hidden
      >
        <Plus className="h-5 w-5" />
      </span>
      <span className="font-semibold text-(--nh-ink)" style={{ fontFamily: "var(--font-display)" }}>
        create a new job
      </span>
      <span className="max-w-[20ch] text-sm text-(--nh-ink-soft)">
        Get your open role in front of candidates in minutes.
      </span>
    </button>
  );
}