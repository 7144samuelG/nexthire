"use client";

import { useState, useEffect } from "react";

type Status = "active" | "closed" | "draft" | "review";

interface StatItem {
  label: string;
  value: number;
  desc: string;
  badge: string;
  Icon: React.FC<{ color: string }>;
  accent: string;
  iconBg: string;
  iconColor: string;
  trend: string;
  up: boolean;
}

interface Job {
  id: number;
  title: string;
  role: string;
  date: string;
  status: Status;
}

interface StatusConfig {
  label: string;
  bg: string;
  color: string;
  dot: string;
}

const STATUS_CONFIG: Record<Status, StatusConfig> = {
  active: { label: "Active",    bg: "#EAF3DE", color: "#3B6D11", dot: "#639922" },
  closed: { label: "Closed",    bg: "#FCEBEB", color: "#A32D2D", dot: "#E24B4A" },
  draft:  { label: "Draft",     bg: "#F3F4F6", color: "#6B7280", dot: "#9CA3AF" },
  review: { label: "In review", bg: "#FAEEDA", color: "#854F0B", dot: "#BA7517" },
};

const STATS: StatItem[] = [
  { label: "Total jobs",  value: 248, desc: "All time",        badge: "All",  Icon: BriefcaseIcon, accent: "#378ADD", iconBg: "#E6F1FB", iconColor: "#0C447C", trend: "+12% this month", up: true  },
  { label: "Active jobs", value: 134, desc: "Open & hiring",   badge: "Live", Icon: ClockIcon,     accent: "#1D9E75", iconBg: "#E1F5EE", iconColor: "#085041", trend: "+5 this week",    up: true  },
  { label: "Closed jobs", value: 89,  desc: "Filled or expired", badge: "Done", Icon: CheckIcon,  accent: "#D85A30", iconBg: "#FAECE7", iconColor: "#712B13", trend: "−3 this week",    up: false },
  { label: "Upcoming",    value: 25,  desc: "Scheduled soon",  badge: "Soon", Icon: BoltIcon,      accent: "#BA7517", iconBg: "#FAEEDA", iconColor: "#633806", trend: "+8 next week",   up: true  },
];

const JOBS: Job[] = [
  { id: 1, title: "Senior Frontend Engineer", role: "Engineering",    date: "May 18, 2025", status: "active" },
  { id: 2, title: "Product Designer",          role: "Design",         date: "May 15, 2025", status: "review" },
  { id: 3, title: "Backend Engineer",          role: "Engineering",    date: "May 12, 2025", status: "active" },
  { id: 4, title: "Marketing Lead",            role: "Marketing",      date: "May 10, 2025", status: "closed" },
  { id: 5, title: "DevOps Engineer",           role: "Infrastructure", date: "May 5, 2025",  status: "draft"  },
];

function AnimatedNumber({ target }: { target: number }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start: number | null = null;
    const dur = 1200;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      setCount(Math.round((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target]);
  return <>{count}</>;
}

function StatCard({ stat }: { stat: StatItem }) {
  const pct = Math.round((stat.value / 248) * 100);
  return (
    <div style={{
      background: "#fff", border: "0.5px solid #E5E7EB", borderRadius: 12,
      padding: 16, position: "relative", overflow: "hidden", cursor: "default",
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ width: 34, height: 34, borderRadius: 8, background: stat.iconBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <stat.Icon color={stat.iconColor} />
        </div>
        <span style={{ fontSize: 10, fontWeight: 500, letterSpacing: ".06em", padding: "2px 7px", borderRadius: 20, background: "#F3F4F6", border: "0.5px solid #E5E7EB", color: "#9CA3AF" }}>
          {stat.badge}
        </span>
      </div>
      <div style={{ fontSize: 32, fontWeight: 500, color: stat.accent, letterSpacing: "-.03em", lineHeight: 1, marginBottom: 3 }}>
        <AnimatedNumber target={stat.value} />
      </div>
      <div style={{ fontSize: 12, fontWeight: 500, color: "#374151", marginBottom: 2 }}>{stat.label}</div>
      <div style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 14 }}>{stat.desc}</div>
      <div style={{ height: "0.5px", background: "#F3F4F6", marginBottom: 10 }} />
      <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 500 }}>
        <span style={{ width: 5, height: 5, borderRadius: "50%", background: stat.up ? "#639922" : "#E24B4A", flexShrink: 0 }} />
        <span style={{ color: stat.up ? "#3B6D11" : "#A32D2D" }}>{stat.trend}</span>
      </div>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: stat.accent + "22" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: stat.accent }} />
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: Status }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 500, padding: "3px 9px", borderRadius: 20, background: cfg.bg, color: cfg.color }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: cfg.dot, flexShrink: 0 }} />
      {cfg.label}
    </span>
  );
}

interface JobsDashboardProps {
  onViewJob?: (job: Job) => void;
  onViewAll?: () => void;
  totalJobs?: number;
}

export default function JobsDashboard({ onViewJob, onViewAll, totalJobs }: JobsDashboardProps) {
  const [query, setQuery] = useState("");
  const today = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  const filtered = JOBS.filter((j) =>
    [j.title, j.role, j.status].some((f) => f.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div style={{ background: "#F3F4F6", minHeight: "100vh", padding: "32px 24px", fontFamily: "inherit" }}>

      {/* Page header */}
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 18, fontWeight: 500, color: "#111827", margin: 0 }}>Jobs overview</h1>
          <p style={{ fontSize: 12, color: "#9CA3AF", marginTop: 4, marginBottom: 0 }}>Track and manage all your job postings</p>
        </div>
        <span style={{ fontSize: 12, color: "#9CA3AF" }}>{today}</span>
      </div>

      {/* Stats grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 24 }}>
        {STATS.map((s) => <StatCard key={s.label} stat={s} />)}
      </div>

      {/* Table section header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: 7, background: "#fff", border: "0.5px solid #E5E7EB", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ListIcon />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 500, color: "#111827" }}>Recent postings</div>
            <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 1 }}>Your 5 latest listings</div>
          </div>
          <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 20, background: "#fff", border: "0.5px solid #E5E7EB", color: "#6B7280", fontWeight: 500 }}>
            {filtered.length} job{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Search */}
        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
          <SearchIcon />
          <input
            type="text"
            placeholder="Search jobs…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ fontSize: 12, padding: "6px 10px 6px 28px", borderRadius: 7, border: "0.5px solid #E5E7EB", background: "#fff", color: "#111827", width: 160, outline: "none" }}
          />
        </div>
      </div>

      {/* Table card */}
      <div style={{ background: "#fff", border: "0.5px solid #E5E7EB", borderRadius: 12, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
          <colgroup>
            <col style={{ width: "44%" }} />
            <col style={{ width: "25%" }} />
            <col style={{ width: "19%" }} />
            <col style={{ width: "12%" }} />
          </colgroup>
          <thead>
            <tr style={{ background: "#F9FAFB", borderBottom: "0.5px solid #E5E7EB" }}>
              {(["Job title", "Date posted", "Status", ""] as const).map((h, i) => (
                <th key={i} style={{ padding: "9px 14px", fontSize: 10, fontWeight: 500, color: "#9CA3AF", textAlign: i === 3 ? "right" : "left", letterSpacing: ".08em", textTransform: "uppercase" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((job, idx) => (
                <tr key={job.id} style={{ borderBottom: idx === filtered.length - 1 ? "none" : "0.5px solid #F3F4F6" }}>
                  <td style={{ padding: "12px 14px" }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: 2 }}>{job.title}</div>
                    <div style={{ fontSize: 11, color: "#9CA3AF" }}>{job.role}</div>
                  </td>
                  <td style={{ padding: "12px 14px" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#6B7280" }}>
                      <CalendarIcon />
                      {job.date}
                    </span>
                  </td>
                  <td style={{ padding: "12px 14px" }}>
                    <StatusPill status={job.status} />
                  </td>
                  <td style={{ padding: "12px 14px", textAlign: "right" }}>
                    <button
                      onClick={() => onViewJob?.(job)}
                      style={{ fontSize: 11, fontWeight: 500, padding: "5px 11px", borderRadius: 6, border: "0.5px solid #D1D5DB", background: "transparent", color: "#6B7280", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4 }}
                    >
                      <EyeIcon /> View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} style={{ padding: "36px 14px", textAlign: "center", fontSize: 13, color: "#9CA3AF" }}>
                  No jobs match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Footer */}
        <div style={{ padding: "11px 14px", borderTop: "0.5px solid #F3F4F6", background: "#F9FAFB", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 11, color: "#9CA3AF" }}>Showing 5 of {totalJobs} jobs</span>
          <button
            onClick={onViewAll}
            style={{ fontSize: 12, fontWeight: 500, padding: "6px 16px", borderRadius: 7, border: "0.5px solid #D1D5DB", background: "#fff", color: "#374151", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 5 }}
          >
            View all <ArrowRightIcon />
          </button>
        </div>
      </div>
    </div>
  );
}

function BriefcaseIcon({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
    </svg>
  );
}
function ClockIcon({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
function CheckIcon({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
function BoltIcon({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}
function ListIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  );
}
function SearchIcon() {
  return (
    <svg style={{ position: "absolute", left: 8, width: 13, height: 13, color: "#9CA3AF", pointerEvents: "none" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}
function CalendarIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}
function EyeIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
  );
}
function ArrowRightIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
  );
}