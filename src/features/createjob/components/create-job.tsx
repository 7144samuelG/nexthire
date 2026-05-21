"use client";

import {
  useState,
  useRef,
  KeyboardEvent,
  ChangeEvent,
  DragEvent,
} from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type WorkMode = "REMOTE" | "HYBRID" | "OFFSITE";

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
  posterImage: string | null; // base64 data URL
}

interface RequiredField {
  label: string;
  check: (v: JobFormValues) => boolean;
}

interface CreateJobFormProps {
  onSubmit?: (values: JobFormValues) => void;
  onSaveDraft?: (values: JobFormValues) => void;
  onBack?: () => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const REQUIRED_FIELDS: RequiredField[] = [
  { label: "Job title",       check: (v) => v.title.trim().length > 0 },
  { label: "Company name",    check: (v) => v.companyName.trim().length > 0 },
  { label: "Description",     check: (v) => v.description.trim().length > 20 },
  { label: "Application slug",check: (v) => v.formSlug.trim().length > 0 },
  { label: "Location",        check: (v) => v.location.trim().length > 0 },
  { label: "Employment type", check: (v) => v.employmentType.length > 0 },
  { label: "Work mode",       check: (v) => v.workMode !== null },
  { label: "Skills required", check: (v) => v.skillsRequired.length > 0 },
  { label: "Requirements",    check: (v) => v.requirements.trim().length > 10 },
];

const WORK_MODES: { value: WorkMode; label: string; icon: string }[] = [
  { value: "OFFSITE", label: "On-site",  icon: "ti-building" },
  { value: "HYBRID",  label: "Hybrid",   icon: "ti-building-community" },
  { value: "REMOTE",  label: "Remote",   icon: "ti-home" },
];

const CURRENCIES = ["USD", "EUR", "GBP", "KES", "NGN"];
const EMPLOYMENT_TYPES = ["Full-time", "Part-time", "Contract", "Internship", "Freelance"];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function slugify(str: string): string {
  return str.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
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
    <div style={{ background: "#fff", border: "0.5px solid #E5E7EB", borderRadius: 12, overflow: "hidden", marginBottom: 12 }}>
      <div style={{ padding: "14px 16px 12px", borderBottom: "0.5px solid #E5E7EB", display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 28, height: 28, borderRadius: 7, background: "#F9FAFB", border: "0.5px solid #E5E7EB", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <i className={`ti ${icon}`} style={{ fontSize: 15, color: "#6B7280" }} aria-hidden="true" />
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 500, color: "#111827" }}>{title}</div>
          <div style={{ fontSize: 11, color: "#9CA3AF" }}>{subtitle}</div>
        </div>
      </div>
      <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 14 }}>
        {children}
      </div>
    </div>
  );
}

function Field({ label, required, optional, hint, children }: {
  label: string;
  required?: boolean;
  optional?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <label style={{ fontSize: 12, fontWeight: 500, color: "#6B7280", display: "flex", alignItems: "center", gap: 4 }}>
        {label}
        {required && <span style={{ color: "#E24B4A", fontSize: 11 }}>*</span>}
        {optional && <span style={{ fontSize: 10, color: "#9CA3AF", fontWeight: 400, marginLeft: 2 }}>(optional)</span>}
      </label>
      {children}
      {hint && <span style={{ fontSize: 11, color: "#9CA3AF" }}>{hint}</span>}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  fontSize: 13, padding: "8px 10px", borderRadius: 8,
  border: "0.5px solid #E5E7EB", background: "#fff",
  color: "#111827", width: "100%", outline: "none",
  fontFamily: "inherit",
};

// ─── Main Component ───────────────────────────────────────────────────────────

export const CreateJobForm=({ onSubmit, onSaveDraft, onBack }: CreateJobFormProps)=> {
  const [values, setValues] = useState<JobFormValues>({
    title: "", companyName: "", description: "", formSlug: "",
    location: "", employmentType: "", workMode: null,
    currency: "USD", salaryMin: "", salaryMax: "",
    skillsRequired: [], requirements: "", deadline: "",
    posterImage: null,
  });

  const [skillInput, setSkillInput] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const completedCount = REQUIRED_FIELDS.filter((f) => f.check(values)).length;
  const pct = Math.round((completedCount / REQUIRED_FIELDS.length) * 100);

  return (
    <div style={{ background: "#F3F4F6", minHeight: "100vh", padding: "28px 24px", fontFamily: "inherit" }}>

      {/* Top bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={onBack} style={{ width: 32, height: 32, borderRadius: 8, border: "0.5px solid #E5E7EB", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
          </button>
          <div>
            <div style={{ fontSize: 15, fontWeight: 500, color: "#111827" }}>Create job posting</div>
            <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>Fill in the details to publish your listing</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => onSaveDraft?.(values)} style={{ fontSize: 12, fontWeight: 500, padding: "7px 14px", borderRadius: 8, border: "0.5px solid #D1D5DB", background: "#fff", color: "#374151", cursor: "pointer" }}>
            Save draft
          </button>
          <button onClick={() => onSubmit?.(values)} style={{ fontSize: 12, fontWeight: 500, padding: "7px 18px", borderRadius: 8, border: "none", background: "#378ADD", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            Publish
          </button>
        </div>
      </div>

      {/* Layout */}
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 240px", gap: 14, alignItems: "start" }}>

        {/* Left column */}
        <div>

          {/* Basic info */}
          <CardSection icon="ti-id-badge" title="Basic information" subtitle="Core details about the role">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Field label="Job title" required>
                <input style={inputStyle} type="text" value={values.title} onChange={handleTitleChange} placeholder="e.g. Senior Frontend Engineer" />
              </Field>
              <Field label="Company name" required>
                <input style={inputStyle} type="text" value={values.companyName} onChange={(e) => set("companyName", e.target.value)} placeholder="e.g. Acme Inc." />
              </Field>
            </div>
            <Field label="Job description" required hint="Supports Markdown formatting">
              <textarea
                style={{ ...inputStyle, minHeight: 110, resize: "vertical", lineHeight: 1.6 }}
                value={values.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="Describe the role, responsibilities, and what makes it exciting…"
              />
            </Field>
            <Field label="Application URL slug" required hint="Unique URL candidates will use to apply">
              <div style={{ display: "flex", alignItems: "center", border: "0.5px solid #E5E7EB", borderRadius: 8, overflow: "hidden" }}>
                <span style={{ fontSize: 12, padding: "8px 10px", background: "#F9FAFB", color: "#9CA3AF", whiteSpace: "nowrap", borderRight: "0.5px solid #E5E7EB" }}>
                  nexthire.com/apply/
                </span>
                <input
                  style={{ ...inputStyle, border: "none", borderRadius: 0, paddingLeft: 8 }}
                  type="text"
                  value={values.formSlug}
                  onChange={(e) => { setSlugEdited(true); set("formSlug", e.target.value); }}
                  placeholder="senior-frontend-engineer"
                />
              </div>
            </Field>
          </CardSection>

          {/* Logistics */}
          <CardSection icon="ti-map-pin" title="Logistics" subtitle="Location, work mode & contract">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Field label="Location" required>
                <input style={inputStyle} type="text" value={values.location} onChange={(e) => set("location", e.target.value)} placeholder="e.g. Nairobi, Kenya" />
              </Field>
              <Field label="Employment type" required>
                <select style={inputStyle} value={values.employmentType} onChange={(e) => set("employmentType", e.target.value)}>
                  <option value="">Select type…</option>
                  {EMPLOYMENT_TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </Field>
            </div>
            <Field label="Work mode" required>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                {WORK_MODES.map((m) => (
                  <button
                    key={m.value}
                    onClick={() => set("workMode", m.value)}
                    style={{
                      border: `0.5px solid ${values.workMode === m.value ? "#378ADD" : "#E5E7EB"}`,
                      borderRadius: 8, padding: "8px 6px", textAlign: "center", cursor: "pointer",
                      background: values.workMode === m.value ? "#E6F1FB" : "#fff",
                      transition: "all .15s",
                    }}
                  >
                    <i className={`ti ${m.icon}`} style={{ fontSize: 18, color: values.workMode === m.value ? "#0C447C" : "#6B7280", display: "block", marginBottom: 4 }} aria-hidden="true" />
                    <span style={{ fontSize: 11, fontWeight: 500, color: values.workMode === m.value ? "#0C447C" : "#6B7280" }}>{m.label}</span>
                  </button>
                ))}
              </div>
            </Field>
          </CardSection>

          {/* Compensation */}
          <CardSection icon="ti-currency-dollar" title="Compensation" subtitle="Salary range and currency">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Field label="Minimum salary" optional>
                <div style={{ display: "flex" }}>
                  <select
                    style={{ ...inputStyle, width: 80, borderRadius: "8px 0 0 8px", borderRight: "none", background: "#F9FAFB", flexShrink: 0 }}
                    value={values.currency}
                    onChange={(e) => set("currency", e.target.value)}
                  >
                    {CURRENCIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                  <input
                    style={{ ...inputStyle, borderRadius: "0 8px 8px 0" }}
                    type="number" min="0" value={values.salaryMin}
                    onChange={(e) => set("salaryMin", e.target.value)}
                    placeholder="50,000"
                  />
                </div>
              </Field>
              <Field label="Maximum salary" optional>
                <input style={inputStyle} type="number" min="0" value={values.salaryMax} onChange={(e) => set("salaryMax", e.target.value)} placeholder="90,000" />
              </Field>
            </div>
            <span style={{ fontSize: 11, color: "#9CA3AF" }}>Leave blank to display "Competitive salary" to candidates</span>
          </CardSection>

          {/* Skills & requirements */}
          <CardSection icon="ti-list-check" title="Skills & requirements" subtitle="What candidates need to qualify">
            <Field label="Skills required" required hint="Press Enter or comma to add each skill">
              <div
                style={{ display: "flex", flexWrap: "wrap", gap: 6, padding: "8px 10px", border: "0.5px solid #E5E7EB", borderRadius: 8, minHeight: 42, cursor: "text", background: "#fff" }}
                onClick={() => document.getElementById("skill-inp")?.focus()}
              >
                {values.skillsRequired.map((s) => (
                  <span key={s} style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 500, padding: "3px 8px", borderRadius: 20, background: "#E6F1FB", color: "#0C447C" }}>
                    {s}
                    <button onClick={(e) => { e.stopPropagation(); removeSkill(s); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#378ADD", fontSize: 14, lineHeight: 1, padding: 0, display: "flex", alignItems: "center" }} aria-label={`Remove ${s}`}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                  </span>
                ))}
                <input
                  id="skill-inp"
                  style={{ fontSize: 12, border: "none", outline: "none", background: "transparent", color: "#111827", minWidth: 80, padding: "2px 0", fontFamily: "inherit", flex: 1 }}
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={addSkill}
                  placeholder={values.skillsRequired.length === 0 ? "Type a skill and press Enter…" : ""}
                />
              </div>
            </Field>
            <Field label="Requirements" required>
              <textarea
                style={{ ...inputStyle, minHeight: 90, resize: "vertical", lineHeight: 1.6 }}
                value={values.requirements}
                onChange={(e) => set("requirements", e.target.value)}
                placeholder="List candidate requirements, qualifications, and experience needed…"
              />
            </Field>
            <Field label="Application deadline" optional>
              <input style={inputStyle} type="datetime-local" value={values.deadline} onChange={(e) => set("deadline", e.target.value)} />
            </Field>
          </CardSection>

        </div>

        {/* Right sidebar */}
        <div>

          {/* Progress */}
          <div style={{ background: "#fff", border: "0.5px solid #E5E7EB", borderRadius: 12, overflow: "hidden", marginBottom: 12 }}>
            <div style={{ padding: "12px 14px", borderBottom: "0.5px solid #E5E7EB", fontSize: 12, fontWeight: 500, color: "#6B7280", display: "flex", alignItems: "center", gap: 6 }}>
              <i className="ti ti-chart-pie" style={{ fontSize: 15 }} aria-hidden="true" /> Form completion
            </div>
            <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 11, color: "#6B7280" }}>Progress</span>
                  <span style={{ fontSize: 11, fontWeight: 500, color: "#111827" }}>{pct}%</span>
                </div>
                <div style={{ height: 4, background: "#F3F4F6", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: "#378ADD", borderRadius: 4, transition: "width .3s" }} />
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {REQUIRED_FIELDS.map((f) => {
                  const done = f.check(values);
                  return (
                    <div key={f.label} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, color: done ? "#3B6D11" : "#9CA3AF" }}>
                      <i className={`ti ${done ? "ti-circle-check" : "ti-circle"}`} style={{ fontSize: 14, color: done ? "#639922" : "#D1D5DB" }} aria-hidden="true" />
                      {f.label}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Poster image */}
          <div style={{ background: "#fff", border: "0.5px solid #E5E7EB", borderRadius: 12, overflow: "hidden", marginBottom: 12 }}>
            <div style={{ padding: "12px 14px", borderBottom: "0.5px solid #E5E7EB", fontSize: 12, fontWeight: 500, color: "#6B7280", display: "flex", alignItems: "center", gap: 6 }}>
              <i className="ti ti-photo" style={{ fontSize: 15 }} aria-hidden="true" />
              Job poster
              <span style={{ fontSize: 10, color: "#9CA3AF", fontWeight: 400, marginLeft: 2 }}>optional</span>
            </div>
            <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 8 }}>
              {!values.posterImage ? (
                <div
                  style={{ border: "0.5px dashed #D1D5DB", borderRadius: 10, padding: 20, textAlign: "center", cursor: "pointer" }}
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                >
                  <i className="ti ti-cloud-upload" style={{ fontSize: 22, color: "#9CA3AF", display: "block", marginBottom: 6 }} aria-hidden="true" />
                  <div style={{ fontSize: 12, fontWeight: 500, color: "#6B7280" }}>Upload poster image</div>
                  <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>PNG, JPG up to 5 MB</div>
                </div>
              ) : (
                <div>
                  <img src={values.posterImage} alt="Job poster preview" style={{ width: "100%", aspectRatio: "16/9", borderRadius: 8, objectFit: "cover", display: "block" }} />
                  <button onClick={() => set("posterImage", null)} style={{ fontSize: 11, fontWeight: 500, color: "#A32D2D", cursor: "pointer", background: "none", border: "none", padding: "4px 0", marginTop: 6, display: "flex", alignItems: "center", gap: 4 }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                    Remove image
                  </button>
                </div>
              )}
              <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
              <span style={{ fontSize: 11, color: "#9CA3AF" }}>Used as cover on your job listing page</span>
            </div>
          </div>

          {/* Publish */}
          <div style={{ background: "#fff", border: "0.5px solid #E5E7EB", borderRadius: 12, overflow: "hidden" }}>
            <div style={{ padding: "12px 14px", borderBottom: "0.5px solid #E5E7EB", fontSize: 12, fontWeight: 500, color: "#6B7280", display: "flex", alignItems: "center", gap: 6 }}>
              <i className="ti ti-send" style={{ fontSize: 15 }} aria-hidden="true" /> Publish
            </div>
            <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 8 }}>
              <button onClick={() => onSubmit?.(values)} style={{ fontSize: 13, fontWeight: 500, padding: 9, borderRadius: 8, border: "none", background: "#378ADD", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                <i className="ti ti-rocket" style={{ fontSize: 15 }} aria-hidden="true" /> Publish job
              </button>
              <button onClick={() => onSaveDraft?.(values)} style={{ fontSize: 13, fontWeight: 500, padding: 9, borderRadius: 8, border: "0.5px solid #D1D5DB", background: "transparent", color: "#374151", cursor: "pointer" }}>
                Save as draft
              </button>
              <span style={{ fontSize: 11, color: "#9CA3AF", textAlign: "center" }}>You can edit or unpublish at any time</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}