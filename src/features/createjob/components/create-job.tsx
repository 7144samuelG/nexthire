"use client";

import { useRouter } from "next/navigation";
import {
  useState,
  useRef,
  KeyboardEvent,
  ChangeEvent,
  DragEvent,
} from "react";
import { toast } from "sonner";
import { useCreateNewJob } from "../hooks/use-jobflows";

// ─── Types ────────────────────────────────────────────────────────────────────

type WorkMode = "REMOTE" | "HYBRID" | "OFFSITE";
type EmploymentType =
  | "Full-time"
  | "Part-time"
  | "Contract"
  | "Internship"
  | "Freelance";

interface JobFormValues {
  title: string;
  companyName: string;
  description: string;
  formSlug: string;
  location: string;
  employmentType: string;
  workMode: WorkMode | null;
  currency: string;
  salaryMin: string;
  salaryMax: string;
  skillsRequired: string[];
  requirements: string;
  deadline: string;
  posterImage: string | null;
}

interface RequiredField {
  label: string;
  check: (v: JobFormValues) => boolean;
}

interface CreateJobFormProps {
  onBack?: () => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const REQUIRED_FIELDS: RequiredField[] = [
  { label: "Job title",        check: (v) => v.title.trim().length >= 5 },
  { label: "Company name",     check: (v) => v.companyName.trim().length > 0 },
  { label: "Description",      check: (v) => v.description.trim().length > 20 },
  { label: "Application slug", check: (v) => /^[a-z0-9-]{3,}$/.test(v.formSlug) },
  { label: "Location",         check: (v) => v.location.trim().length > 0 },
  { label: "Employment type",  check: (v) => v.employmentType.length > 0 },
  { label: "Work mode",        check: (v) => v.workMode !== null },
  { label: "Skills required",  check: (v) => v.skillsRequired.length > 0 },
  { label: "Requirements",     check: (v) => v.requirements.trim().length > 10 },
];

const WORK_MODES: { value: WorkMode; label: string; icon: string }[] = [
  { value: "OFFSITE", label: "On-site", icon: "🏢" },
  { value: "HYBRID",  label: "Hybrid",  icon: "🏙️" },
  { value: "REMOTE",  label: "Remote",  icon: "🏠" },
];

const CURRENCIES      = ["USD", "EUR", "GBP", "KES", "NGN"];
const EMPLOYMENT_TYPES = ["Full-time", "Part-time", "Contract", "Internship", "Freelance"];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function slugify(str: string): string {
  return str.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

function buildMutationPayload(values: JobFormValues) {
  return {
    title:          values.title.trim(),
    companyName:    values.companyName.trim(),
    description:    values.description.trim(),
    location:       values.location.trim(),
    employmentType: values.employmentType as EmploymentType,
    workMode:       values.workMode as WorkMode,
    currency:       values.currency,
    salaryMin:      values.salaryMin ? parseInt(values.salaryMin, 10) : undefined,
    salaryMax:      values.salaryMax ? parseInt(values.salaryMax, 10) : undefined,
    skillsRequired: values.skillsRequired,
    requirements:   values.requirements.trim(),
    deadline:       values.deadline ? new Date(values.deadline) : undefined,
  };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function CardSection({
  icon,
  title,
  subtitle,
  children,
}: {
  icon: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-3">
      <div className="px-4 py-3 border-b border-gray-200 flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center text-base">
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">{title}</p>
          <p className="text-xs text-gray-400">{subtitle}</p>
        </div>
      </div>
      <div className="p-4 flex flex-col gap-4">{children}</div>
    </div>
  );
}

function Field({
  label,
  required,
  optional,
  hint,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  optional?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
        {label}
        {required && <span className="text-red-500 text-xs">*</span>}
        {optional && <span className="text-xs text-gray-400 font-normal ml-0.5">(optional)</span>}
      </label>
      {children}
      {error  && <span className="text-xs text-red-500">{error}</span>}
      {!error && hint && <span className="text-xs text-gray-400">{hint}</span>}
    </div>
  );
}

const baseInput =
  "text-sm px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-900 w-full outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all placeholder:text-gray-400";
const errorInput =
  "text-sm px-3 py-2 rounded-lg border border-red-400 bg-white text-gray-900 w-full outline-none focus:ring-2 focus:ring-red-100 transition-all placeholder:text-gray-400";

// ─── Main Component ───────────────────────────────────────────────────────────

export const CreateJobForm = ({ onBack }: CreateJobFormProps) => {
  const router     = useRouter();
  const createNewJob = useCreateNewJob();

  const [values, setValues] = useState<JobFormValues>({
    title: "", companyName: "", description: "", formSlug: "",
    location: "", employmentType: "", workMode: null,
    currency: "USD", salaryMin: "", salaryMax: "",
    skillsRequired: [], requirements: "", deadline: "",
    posterImage: null,
  });

  const [skillInput, setSkillInput]   = useState("");
  const [slugEdited, setSlugEdited]   = useState(false);
  const [submitted,  setSubmitted]    = useState(false);
  const fileInputRef                  = useRef<HTMLInputElement>(null);

  // ── Helpers ────────────────────────────────────────────────────────────────

  const set = (key: keyof JobFormValues, val: unknown) =>
    setValues((prev) => ({ ...prev, [key]: val }));

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const t = e.target.value;
    set("title", t);
    if (!slugEdited) set("formSlug", slugify(t));
  };

  const addSkill = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const v = skillInput.replace(/,$/, "").trim();
      if (v && !values.skillsRequired.includes(v)) {
        set("skillsRequired", [...values.skillsRequired, v]);
      }
      setSkillInput("");
    }
  };

  const removeSkill = (s: string) =>
    set("skillsRequired", values.skillsRequired.filter((x) => x !== s));

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => set("posterImage", e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  // ── Form validity ──────────────────────────────────────────────────────────

  const completedCount = REQUIRED_FIELDS.filter((f) => f.check(values)).length;
  const pct            = Math.round((completedCount / REQUIRED_FIELDS.length) * 100);
  const isValid        = completedCount === REQUIRED_FIELDS.length;
  const isLoading      = createNewJob.isPending;

  const err = (check: boolean) => submitted && !check;

  // ── Publish ────────────────────────────────────────────────────────────────

  const handlePublish = () => {
    setSubmitted(true);
    if (!isValid) {
      toast.error("Please complete all required fields before publishing.");
      return;
    }
    // ✅ Fixed: payload as first arg, callbacks as second arg, correct variable name
    createNewJob.mutate(buildMutationPayload(values), {
      onSuccess: (data) => {
        router.push(`/jobs/${data.job.id}`);
      },
      onError: (error) => {
        toast.error(`Failed to create job: ${error.message}`);
      },
    });
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="bg-gray-100 min-h-screen px-6 py-7 font-sans">

      {/* Top bar */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <button
            onClick={onBack ?? (() => router.back())}
            className="w-8 h-8 rounded-lg border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <div>
            <p className="text-sm font-medium text-gray-900">Create job posting</p>
            <p className="text-xs text-gray-400 mt-0.5">Fill in the details to publish your listing</p>
          </div>
        </div>

        <button
          disabled={isLoading}
          onClick={handlePublish}
          className="flex items-center gap-1.5 text-xs font-medium px-4 py-2 rounded-lg border-none text-white transition-colors cursor-pointer disabled:cursor-not-allowed"
          style={{ background: isLoading ? "#93C5FD" : "#378ADD" }}
        >
          {isLoading ? (
            <>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin">
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
              Publishing…
            </>
          ) : (
            <>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
              Publish
            </>
          )}
        </button>
      </div>

      {/* Layout */}
      <div className="grid gap-3.5 items-start" style={{ gridTemplateColumns: "minmax(0,1fr) 240px" }}>

        {/* ── Left column ── */}
        <div>

          {/* Basic info */}
          <CardSection icon="🪪" title="Basic information" subtitle="Core details about the role">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Job title" required error={err(values.title.trim().length >= 5) ? "Minimum 5 characters" : undefined}>
                <input
                  className={err(values.title.trim().length >= 5) ? errorInput : baseInput}
                  type="text"
                  value={values.title}
                  onChange={handleTitleChange}
                  placeholder="e.g. Senior Frontend Engineer"
                />
              </Field>
              <Field label="Company name" required error={err(values.companyName.trim().length > 0) ? "Required" : undefined}>
                <input
                  className={err(values.companyName.trim().length > 0) ? errorInput : baseInput}
                  type="text"
                  value={values.companyName}
                  onChange={(e) => set("companyName", e.target.value)}
                  placeholder="e.g. Acme Inc."
                />
              </Field>
            </div>

            <Field label="Job description" required hint="Supports Markdown formatting" error={err(values.description.trim().length > 20) ? "Please write a more detailed description" : undefined}>
              <textarea
                className={`${err(values.description.trim().length > 20) ? errorInput : baseInput} min-h-28 resize-y leading-relaxed`}
                value={values.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="Describe the role, responsibilities, and what makes it exciting…"
              />
            </Field>

            <Field label="Application URL slug" required hint="Unique URL candidates will use to apply" error={err(/^[a-z0-9-]{3,}$/.test(values.formSlug)) ? "Lowercase letters, numbers, and hyphens only (min 3 chars)" : undefined}>
              <div className={`flex items-center rounded-lg overflow-hidden border ${err(/^[a-z0-9-]{3,}$/.test(values.formSlug)) ? "border-red-400" : "border-gray-200"} focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-400 transition-all`}>
                <span className="text-xs px-3 py-2 bg-gray-50 text-gray-400 whitespace-nowrap border-r border-gray-200">
                  nexthire.com/apply/
                </span>
                <input
                  className="text-sm px-3 py-2 bg-white text-gray-900 outline-none flex-1 placeholder:text-gray-400"
                  type="text"
                  value={values.formSlug}
                  onChange={(e) => { setSlugEdited(true); set("formSlug", e.target.value); }}
                  placeholder="senior-frontend-engineer"
                />
              </div>
            </Field>
          </CardSection>

          {/* Logistics */}
          <CardSection icon="📍" title="Logistics" subtitle="Location, work mode & contract">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Location" required error={err(values.location.trim().length > 0) ? "Required" : undefined}>
                <input
                  className={err(values.location.trim().length > 0) ? errorInput : baseInput}
                  type="text"
                  value={values.location}
                  onChange={(e) => set("location", e.target.value)}
                  placeholder="e.g. Nairobi, Kenya"
                />
              </Field>
              <Field label="Employment type" required error={err(values.employmentType !== "") ? "Required" : undefined}>
                <select
                  className={err(values.employmentType !== "") ? errorInput : baseInput}
                  value={values.employmentType}
                  onChange={(e) => set("employmentType", e.target.value as EmploymentType)}
                >
                  <option value="">Select type…</option>
                  {EMPLOYMENT_TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </Field>
            </div>

            <Field label="Work mode" required error={err(values.workMode !== null) ? "Please select a work mode" : undefined}>
              <div className="grid grid-cols-3 gap-2">
                {WORK_MODES.map((m) => {
                  const active = values.workMode === m.value;
                  return (
                    <button
                      key={m.value}
                      type="button"
                      onClick={() => set("workMode", m.value)}
                      className={`rounded-lg px-2 py-2.5 text-center cursor-pointer border transition-all ${
                        active
                          ? "border-blue-400 bg-blue-50"
                          : err(values.workMode !== null)
                          ? "border-red-400 bg-white"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                    >
                      <span className="text-lg block mb-1">{m.icon}</span>
                      <span className={`text-xs font-medium ${active ? "text-blue-800" : "text-gray-500"}`}>{m.label}</span>
                    </button>
                  );
                })}
              </div>
            </Field>
          </CardSection>

          {/* Compensation */}
          <CardSection icon="💰" title="Compensation" subtitle="Salary range and currency">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Minimum salary" optional>
                <div className="flex">
                  <select
                    className="text-sm px-2 py-2 rounded-l-lg border border-gray-200 border-r-0 bg-gray-50 text-gray-500 outline-none w-20 shrink-0"
                    value={values.currency}
                    onChange={(e) => set("currency", e.target.value)}
                  >
                    {CURRENCIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                  <input
                    className={`${baseInput} rounded-l-none border-l-0`}
                    type="number"
                    min="0"
                    value={values.salaryMin}
                    onChange={(e) => set("salaryMin", e.target.value)}
                    placeholder="50,000"
                  />
                </div>
              </Field>
              <Field
                label="Maximum salary"
                optional
                error={
                  values.salaryMin && values.salaryMax && parseInt(values.salaryMax) < parseInt(values.salaryMin)
                    ? "Must be ≥ minimum salary"
                    : undefined
                }
              >
                <input
                  className={
                    values.salaryMin && values.salaryMax && parseInt(values.salaryMax) < parseInt(values.salaryMin)
                      ? errorInput
                      : baseInput
                  }
                  type="number"
                  min="0"
                  value={values.salaryMax}
                  onChange={(e) => set("salaryMax", e.target.value)}
                  placeholder="90,000"
                />
              </Field>
            </div>
            <p className="text-xs text-gray-400">Leave blank to display "Competitive salary" to candidates</p>
          </CardSection>

          {/* Skills & requirements */}
          <CardSection icon="✅" title="Skills & requirements" subtitle="What candidates need to qualify">
            <Field label="Skills required" required hint="Press Enter or comma to add each skill" error={err(values.skillsRequired.length > 0) ? "Add at least one skill" : undefined}>
              <div
                className={`flex flex-wrap gap-1.5 p-2.5 border rounded-lg min-h-11 cursor-text bg-white transition-all focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-400 ${
                  err(values.skillsRequired.length > 0) ? "border-red-400" : "border-gray-200"
                }`}
                onClick={() => document.getElementById("skill-inp")?.focus()}
              >
                {values.skillsRequired.map((s) => (
                  <span key={s} className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-blue-50 text-blue-800">
                    {s}
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); removeSkill(s); }}
                      className="text-blue-400 hover:text-blue-700 flex items-center transition-colors cursor-pointer bg-transparent border-none p-0"
                      aria-label={`Remove ${s}`}
                    >
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </span>
                ))}
                <input
                  id="skill-inp"
                  className="text-xs border-none outline-none bg-transparent text-gray-900 min-w-20 py-0.5 flex-1 placeholder:text-gray-400"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={addSkill}
                  placeholder={values.skillsRequired.length === 0 ? "Type a skill and press Enter…" : ""}
                />
              </div>
            </Field>

            <Field label="Requirements" required error={err(values.requirements.trim().length > 10) ? "Please provide more detail" : undefined}>
              <textarea
                className={`${err(values.requirements.trim().length > 10) ? errorInput : baseInput} min-h-24 resize-y leading-relaxed`}
                value={values.requirements}
                onChange={(e) => set("requirements", e.target.value)}
                placeholder="List candidate requirements, qualifications, and experience needed…"
              />
            </Field>

            <Field label="Application deadline" optional>
              <input
                className={baseInput}
                type="datetime-local"
                value={values.deadline}
                onChange={(e) => set("deadline", e.target.value)}
              />
            </Field>
          </CardSection>

        </div>

        {/* ── Right sidebar ── */}
        <div>

          {/* Progress */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-3">
            <div className="px-3.5 py-3 border-b border-gray-200 text-xs font-medium text-gray-500 flex items-center gap-1.5">
              📊 Form completion
            </div>
            <div className="p-3.5 flex flex-col gap-3">
              <div>
                <div className="flex justify-between mb-1.5">
                  <span className="text-xs text-gray-500">Progress</span>
                  <span className={`text-xs font-medium ${pct === 100 ? "text-green-700" : "text-gray-900"}`}>{pct}%</span>
                </div>
                <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{ width: `${pct}%`, background: pct === 100 ? "#639922" : "#378ADD" }}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                {REQUIRED_FIELDS.map((f) => {
                  const done = f.check(values);
                  return (
                    <div key={f.label} className={`flex items-center gap-1.5 text-xs ${done ? "text-green-700" : "text-gray-400"}`}>
                      <span className={`text-sm ${done ? "text-green-600" : "text-gray-300"}`}>{done ? "✓" : "○"}</span>
                      {f.label}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Poster image */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-3">
            <div className="px-3.5 py-3 border-b border-gray-200 text-xs font-medium text-gray-500 flex items-center gap-1.5">
              🖼️ Job poster
              <span className="text-xs text-gray-400 font-normal ml-0.5">(optional)</span>
            </div>
            <div className="p-3.5 flex flex-col gap-2">
              {!values.posterImage ? (
                <div
                  className="border border-dashed border-gray-300 rounded-lg p-5 text-center cursor-pointer hover:border-blue-300 hover:bg-blue-50/30 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                >
                  <span className="text-2xl block mb-1.5">☁️</span>
                  <p className="text-xs font-medium text-gray-600">Upload poster image</p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5 MB</p>
                </div>
              ) : (
                <div>
                  <img
                    src={values.posterImage}
                    alt="Job poster preview"
                    className="w-full aspect-video rounded-lg object-cover block"
                  />
                  <button
                    type="button"
                    onClick={() => set("posterImage", null)}
                    className="text-xs font-medium text-red-700 cursor-pointer bg-transparent border-none p-0 mt-1.5 flex items-center gap-1 hover:text-red-900 transition-colors"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4h6v2" />
                    </svg>
                    Remove image
                  </button>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
              />
              <p className="text-xs text-gray-400">Used as cover on your job listing page</p>
            </div>
          </div>

          {/* Publish */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="px-3.5 py-3 border-b border-gray-200 text-xs font-medium text-gray-500 flex items-center gap-1.5">
              🚀 Publish
            </div>
            <div className="p-3.5 flex flex-col gap-2">
              {createNewJob.isError && (
                <div className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  {createNewJob.error.message}
                </div>
              )}
              <button
                type="button"
                disabled={isLoading}
                onClick={handlePublish}
                className="text-sm font-medium py-2.5 rounded-lg border-none text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:cursor-not-allowed"
                style={{ background: isLoading ? "#93C5FD" : "#378ADD" }}
              >
                {isLoading ? (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin">
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                    Publishing…
                  </>
                ) : (
                  <>🚀 Publish job</>
                )}
              </button>
              <p className="text-xs text-gray-400 text-center">You can edit or unpublish at any time</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};