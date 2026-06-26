"use client";

import { useRouter } from "next/navigation";
import { useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// shadcn/ui
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/components/ui/field";
import { CardSection } from "./cardsection";
import { useCreateNewJob } from "../hooks/use-jobflows";

// ─── Zod Schema ───────────────────────────────────────────────────────────────

const jobFormSchema = z
  .object({
    title: z.string().min(5, "Minimum 5 characters"),
    companyName: z.string().min(1, "Company name is required"),
    description: z.string().min(21, "Please write a more detailed description"),
    location: z.string().min(1, "Location is required"),
    employmentType: z.enum(
      ["Full-time", "Part-time", "Contract", "Internship", "Freelance"],
      {  message: "Employment type is required" } 
    ),
    workMode: z.enum(["REMOTE", "HYBRID", "OFFSITE"], {
      message: "Please select a work mode" }
    ),
    currency: z.string().default("USD"),
    salaryMin: z.string().min(1, "Minimum salary is required"),
    salaryMax: z.string().min(1, "Maximum salary is required"),
    skillsRequired: z.array(z.string()).min(1, "Add at least one skill"),
    requirements: z.string().min(11, "Please provide more detail"),
    deadline: z.string().min(1, "Application deadline is required"),
    posterImage: z.string().nullable().optional(),
  }).refine(
    (data) => {
      const min = parseFloat(data.salaryMin);
      const max = parseFloat(data.salaryMax);
      if (isNaN(min) || isNaN(max)) return true;
      return min >= 0;
    },
    { message: "Salary cannot be negative", path: ["salaryMin"] }
  )
  .refine(
    (data) =>
      !data.salaryMin ||
      !data.salaryMax ||
      parseInt(data.salaryMax) >= parseInt(data.salaryMin),
    { message: "Maximum salary must be greater than or equal to minimum", path: ["salaryMax"] }
  ) .refine(
    (data) => {
      if (!data.deadline) return false;
      const date = new Date(data.deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // compare date only, ignore time
      return date >= today;
    },
    { message: "Deadline must be today or a future date", path: ["deadline"] }
  );

type JobFormValues = z.infer<typeof jobFormSchema>;

type WorkMode = "REMOTE" | "HYBRID" | "OFFSITE";
type EmploymentType =
  | "Full-time"
  | "Part-time"
  | "Contract"
  | "Internship"
  | "Freelance";

interface CreateJobFormProps {
  onBack?: () => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const WORK_MODES: { value: WorkMode; label: string; icon: string }[] = [
  { value: "OFFSITE", label: "On-site", icon: "🏢" },
  { value: "HYBRID", label: "Hybrid", icon: "🏙️" },
  { value: "REMOTE", label: "Remote", icon: "🏠" },
];

const CURRENCIES = ["USD", "EUR", "GBP", "KES", "NGN"];
const EMPLOYMENT_TYPES: EmploymentType[] = [
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
  "Freelance",
];

// ─── Styles ───────────────────────────────────────────────────────────────────

const baseInput =
  "text-sm px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-900 w-full outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all placeholder:text-gray-400";
const errorInput =
  "text-sm px-3 py-2 rounded-lg border border-red-400 bg-white text-gray-900 w-full outline-none focus:ring-2 focus:ring-red-100 transition-all placeholder:text-gray-400";
const labelCls = "text-xs font-medium text-gray-500 flex items-center gap-1";



// ─── Main Component ───────────────────────────────────────────────────────────

export const CreateJobForm = ({ onBack }: CreateJobFormProps) => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const create=useCreateNewJob();

  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobFormSchema) as any,
    mode: "onChange",
    defaultValues: {
      title: "",
      companyName: "",
      description: "",
      location: "",
      employmentType: "Full-time",
      workMode: "REMOTE",
      currency: "USD",
      salaryMin: "",
      salaryMax: "",
      skillsRequired: [],
      requirements: "",
      deadline: "",
      posterImage: null,
    },
  });
  const { isValid, isDirty } = form.formState;
  const { handleSubmit, watch, setValue } = form;

  const skillsRequired = watch("skillsRequired");
  const posterImage = watch("posterImage");

  // ── Completion progress ────────────────────────────────────────────────────

  const values = watch();
  const REQUIRED_CHECKS = [
    (values.title?.trim().length ?? 0) >= 5,
    (values.companyName?.trim().length ?? 0) > 0,
    (values.description?.trim().length ?? 0) > 20,
    (values.location?.trim().length ?? 0) > 0,
    (values.employmentType?.length ?? 0) > 0,
    values.workMode != null,
    (values.skillsRequired?.length ?? 0) > 0,
    (values.requirements?.trim().length ?? 0) > 10,
  ];
  const REQUIRED_LABELS = [
    "Job title",
    "Company name",
    "Description",
    "Location",
    "Employment type",
    "Work mode",
    "Skills required",
    "Requirements",
  ];
  const completedCount = REQUIRED_CHECKS.filter(Boolean).length;
  const pct = Math.round((completedCount / REQUIRED_CHECKS.length) * 100);

  // ── Skill tag input ────────────────────────────────────────────────────────

  const handleSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const input = e.currentTarget;
      const val = input.value.replace(/,$/, "").trim();
      if (val && !skillsRequired.includes(val)) {
        setValue("skillsRequired", [...skillsRequired, val], {
          shouldValidate: true,
        });
      }
      input.value = "";
    }
  };

  const removeSkill = (skill: string) =>
    setValue(
      "skillsRequired",
      skillsRequired.filter((s) => s !== skill),
      { shouldValidate: true }
    );

  // ── File handling ──────────────────────────────────────────────────────────

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => setValue("posterImage", e.target?.result as string);
    reader.readAsDataURL(file);
  };

  // ── Submit ─────────────────────────────────────────────────────────────────

  const onSubmit = (data: JobFormValues) => {
    const { posterImage, ...rest } = data;

    create.mutateAsync(rest, {
      onSuccess: (data) => {
        router.push(`/jobs/${data.job.id}`);
      },
      onError: (error) => {
        alert("failed to upload form");
      },
    });
    console.log("Job form submitted:", data);
  };

  const onInvalid = () => {
    console.warn("Form invalid – complete all required fields.");
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="bg-gray-100 min-h-screen px-6 py-7 font-sans">
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
            type="button"
              onClick={handleSubmit(onSubmit, onInvalid)}
          className="flex items-center gap-1.5 text-xs font-medium px-4 py-2 rounded-lg border-none text-white transition-colors cursor-pointer"
          style={{ background: "#378ADD" }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
          Publish
        </button>
      </div>

      {/* Layout */}
      <div className="grid gap-3.5 items-start" style={{ gridTemplateColumns: "minmax(0,1fr) 240px" }}>

        {/* ── Left column ── */}
        <div>

          {/* Basic info */}
          <CardSection icon="🪪" title="Basic information" subtitle="Core details about the role">
            <div className="grid grid-cols-2 gap-3">

              {/* Job title */}
              <Controller
                name="title"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="field-title" className={labelCls}>
                      Job title <span className="text-red-500 text-xs">*</span>
                    </FieldLabel>
                    <input
                      {...field}
                      id="field-title"
                      aria-invalid={fieldState.invalid}
                      className={fieldState.invalid ? errorInput : baseInput}
                      type="text"
                      placeholder="e.g. Senior Frontend Engineer"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Company name */}
              <Controller
                name="companyName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="field-company" className={labelCls}>
                      Company name <span className="text-red-500 text-xs">*</span>
                    </FieldLabel>
                    <input
                      {...field}
                      id="field-company"
                      aria-invalid={fieldState.invalid}
                      className={fieldState.invalid ? errorInput : baseInput}
                      type="text"
                      placeholder="e.g. Acme Inc."
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            {/* Description */}
            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="field-description" className={labelCls}>
                    Job description <span className="text-red-500 text-xs">*</span>
                  </FieldLabel>
                  <textarea
                    {...field}
                    id="field-description"
                    aria-invalid={fieldState.invalid}
                    className={`${fieldState.invalid ? errorInput : baseInput} min-h-28 resize-y leading-relaxed`}
                    placeholder="Describe the role, responsibilities, and what makes it exciting…"
                  />
                  {!fieldState.invalid && (
                    <FieldDescription>Supports Markdown formatting</FieldDescription>
                  )}
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </CardSection>

          {/* Logistics */}
          <CardSection icon="📍" title="Logistics" subtitle="Location, work mode & contract">
            <div className="grid grid-cols-2 gap-3">

              {/* Location */}
              <Controller
                name="location"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="field-location" className={labelCls}>
                      Location <span className="text-red-500 text-xs">*</span>
                    </FieldLabel>
                    <input
                      {...field}
                      id="field-location"
                      aria-invalid={fieldState.invalid}
                      className={fieldState.invalid ? errorInput : baseInput}
                      type="text"
                      placeholder="e.g. Nairobi, Kenya"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Employment type */}
              <Controller
                name="employmentType"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="field-employment" className={labelCls}>
                      Employment type <span className="text-red-500 text-xs">*</span>
                    </FieldLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        id="field-employment"
                        aria-invalid={fieldState.invalid}
                        className={fieldState.invalid ? errorInput : baseInput}
                      >
                        <SelectValue placeholder="Select type…" />
                      </SelectTrigger>
                      <SelectContent>
                        {EMPLOYMENT_TYPES.map((t) => (
                          <SelectItem key={t} value={t}>{t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            {/* Work mode */}
            <Controller
              name="workMode"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel className={labelCls}>
                    Work mode <span className="text-red-500 text-xs">*</span>
                  </FieldLabel>
                  <div className="grid grid-cols-3 gap-2">
                    {WORK_MODES.map((m) => {
                      const active = field.value === m.value;
                      return (
                        <button
                          key={m.value}
                          type="button"
                          onClick={() => field.onChange(m.value)}
                          className={`rounded-lg px-2 py-2.5 text-center cursor-pointer border transition-all ${
                            active
                              ? "border-blue-400 bg-blue-50"
                              : fieldState.invalid
                                ? "border-red-400 bg-white"
                                : "border-gray-200 bg-white hover:border-gray-300"
                          }`}
                        >
                          <span className="text-lg block mb-1">{m.icon}</span>
                          <span className={`text-xs font-medium ${active ? "text-blue-800" : "text-gray-500"}`}>
                            {m.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </CardSection>

          {/* Compensation */}
          <CardSection icon="💰" title="Compensation" subtitle="Salary range and currency">
            <div className="grid grid-cols-2 gap-3">

              {/* Salary min – currency picker + number input, no validation required */}
              <Field>
                <FieldLabel className={labelCls}>
                  Minimum salary{" "}
                  <span className="text-xs text-gray-400 font-normal ml-0.5">(optional)</span>
                </FieldLabel>
                <div className="flex">
                  <Controller
                    name="currency"
                    control={form.control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="text-sm px-2 py-2 rounded-l-lg rounded-r-none border border-gray-200 border-r-0 bg-gray-50 text-gray-500 outline-none w-20 shrink-0 h-auto">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {CURRENCIES.map((c) => (
                            <SelectItem key={c} value={c}>{c}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <Controller
                    name="salaryMin"
                    control={form.control}
                    render={({ field }) => (
                      <input
                        {...field}
                        className={`${baseInput} rounded-l-none border-l-0`}
                        type="number"
                        min="0"
                        placeholder="50,000"
                      />
                    )}
                  />
                </div>
              </Field>

              {/* Salary max */}
              <Controller
                name="salaryMax"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="field-salary-max" className={labelCls}>
                      Maximum salary{" "}
                      <span className="text-xs text-gray-400 font-normal ml-0.5">(optional)</span>
                    </FieldLabel>
                    <input
                      {...field}
                      id="field-salary-max"
                      aria-invalid={fieldState.invalid}
                      className={fieldState.invalid ? errorInput : baseInput}
                      type="number"
                      min="0"
                      placeholder="90,000"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
            <p className="text-xs text-gray-400">
              Leave blank to display "Competitive salary" to candidates
            </p>
          </CardSection>

          {/* Skills & requirements */}
          <CardSection icon="✅" title="Skills & requirements" subtitle="What candidates need to qualify">

            {/* Skills – array field, managed manually via setValue */}
            <Controller
              name="skillsRequired"
              control={form.control}
              render={({ fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="skill-inp" className={labelCls}>
                    Skills required <span className="text-red-500 text-xs">*</span>
                  </FieldLabel>
                  <div
                    className={`flex flex-wrap gap-1.5 p-2.5 border rounded-lg min-h-11 cursor-text bg-white transition-all focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-400 ${
                      fieldState.invalid ? "border-red-400" : "border-gray-200"
                    }`}
                    onClick={() => document.getElementById("skill-inp")?.focus()}
                  >
                    {skillsRequired.map((s) => (
                      <span
                        key={s}
                        className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-blue-50 text-blue-800"
                      >
                        {s}
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); removeSkill(s); }}
                          className="text-blue-400 hover:text-blue-700 flex items-center transition-colors cursor-pointer bg-transparent border-none p-0"
                          aria-label={`Remove ${s}`}
                        >
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        </button>
                      </span>
                    ))}
                    <input
                      id="skill-inp"
                      aria-invalid={fieldState.invalid}
                      className="text-xs border-none outline-none bg-transparent text-gray-900 min-w-20 py-0.5 flex-1 placeholder:text-gray-400"
                      onKeyDown={handleSkillKeyDown}
                      placeholder={skillsRequired.length === 0 ? "Type a skill and press Enter…" : ""}
                    />
                  </div>
                  {!fieldState.invalid && (
                    <FieldDescription>Press Enter or comma to add each skill</FieldDescription>
                  )}
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Requirements */}
            <Controller
              name="requirements"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="field-requirements" className={labelCls}>
                    Requirements <span className="text-red-500 text-xs">*</span>
                  </FieldLabel>
                  <textarea
                    {...field}
                    id="field-requirements"
                    aria-invalid={fieldState.invalid}
                    className={`${fieldState.invalid ? errorInput : baseInput} min-h-24 resize-y leading-relaxed`}
                    placeholder="List candidate requirements, qualifications, and experience needed…"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Deadline */}
            <Controller
              name="deadline"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor="field-deadline" className={labelCls}>
                    Application deadline{" "}
                    <span className="text-xs text-gray-400 font-normal ml-0.5">(optional)</span>
                  </FieldLabel>
                  <input
                    {...field}
                    id="field-deadline"
                    className={baseInput}
                    type="datetime-local"
                  />
                </Field>
              )}
            />
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
                  <span className={`text-xs font-medium ${pct === 100 ? "text-green-700" : "text-gray-900"}`}>
                    {pct}%
                  </span>
                </div>
                <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{ width: `${pct}%`, background: pct === 100 ? "#639922" : "#378ADD" }}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                {REQUIRED_LABELS.map((label, i) => {
                  const done = REQUIRED_CHECKS[i];
                  return (
                    <div key={label} className={`flex items-center gap-1.5 text-xs ${done ? "text-green-700" : "text-gray-400"}`}>
                      <span className={`text-sm ${done ? "text-green-600" : "text-gray-300"}`}>
                        {done ? "✓" : "○"}
                      </span>
                      {label}
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
              {!posterImage ? (
                <div
                  className="border border-dashed border-gray-300 rounded-lg p-5 text-center cursor-pointer hover:border-blue-300 hover:bg-blue-50/30 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files[0];
                    if (file) handleFile(file);
                  }}
                >
                  <span className="text-2xl block mb-1.5">☁️</span>
                  <p className="text-xs font-medium text-gray-600">Upload poster image</p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5 MB</p>
                </div>
              ) : (
                <div>
                  <img
                    src={posterImage}
                    alt="Job poster preview"
                    className="w-full aspect-video rounded-lg object-cover block"
                  />
                  <button
                    type="button"
                    disabled={!isValid}
                    onClick={() => setValue("posterImage", null)}
                    className="text-xs font-medium text-red-700 cursor-pointer bg-transparent border-none p-0 mt-1.5 flex items-center gap-1 hover:text-red-900 transition-colors"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6l-1 14H6L5 6" />
                      <path d="M10 11v6" />
                      <path d="M14 11v6" />
                      <path d="M9 6V4h6v2" />
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
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFile(f);
                }}
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
              <button
                type="button"
                onClick={handleSubmit(onSubmit, onInvalid)}
                className="text-sm font-medium py-2.5 rounded-lg border-none text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                style={{ background: "#378ADD" }}
              >
                🚀 Publish job
              </button>
              <p className="text-xs text-gray-400 text-center">
                You can edit or unpublish at any time
              </p>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};