"use client";

import { useState, useEffect } from "react";
import { CreateJobCard } from "./create-job-componet";
import { EmptyView } from "@/components/empty-view";
import {
  ArrowRightIcon,
  BriefcaseIcon,
  CheckIcon,
  ClockIcon,
  ListIcon,
} from "lucide-react";

type Status = "active" | "ended";

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

interface StatusConfig {
  label: string;
  bg: string;
  color: string;
  dot: string;
}

const STATUS_CONFIG: Record<Status, StatusConfig> = {
  active: { label: "Active", bg: "#EAF3DE", color: "#3B6D11", dot: "#639922" },
  ended: { label: "Closed", bg: "#FCEBEB", color: "#A32D2D", dot: "#E24B4A" }
};

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
interface StartCard {
  stat: StatItem;
}

function StatCard({ stat }: StartCard) {
  const pct = Math.round((stat.value / 248) * 100);
  return (
    <div
      style={{
        background: "#fff",
        border: "0.5px solid #E5E7EB",
        borderRadius: 12,
        padding: 16,
        position: "relative",
        overflow: "hidden",
        cursor: "default",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: 14,
        }}
      >
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 8,
            background: stat.iconBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <stat.Icon color={stat.iconColor} />
        </div>
        <span
          style={{
            fontSize: 10,
            fontWeight: 500,
            letterSpacing: ".06em",
            padding: "2px 7px",
            borderRadius: 20,
            background: "#F3F4F6",
            border: "0.5px solid #E5E7EB",
            color: "#9CA3AF",
          }}
        >
          {stat.badge}
        </span>
      </div>
      <div
        style={{
          fontSize: 32,
          fontWeight: 500,
          color: stat.accent,
          letterSpacing: "-.03em",
          lineHeight: 1,
          marginBottom: 3,
        }}
      >
        <AnimatedNumber target={stat.value} />
      </div>
      <div
        style={{
          fontSize: 12,
          fontWeight: 500,
          color: "#374151",
          marginBottom: 2,
        }}
      >
        {stat.label}
      </div>
      <div style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 14 }}>
        {stat.desc}
      </div>
      <div
        style={{ height: "0.5px", background: "#F3F4F6", marginBottom: 10 }}
      />
      {/* <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 500 }}>
        <span style={{ width: 5, height: 5, borderRadius: "50%", background: stat.up ? "#639922" : "#E24B4A", flexShrink: 0 }} />
        <span style={{ color: stat.up ? "#3B6D11" : "#A32D2D" }}>{stat.trend}</span>
      </div>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: stat.accent + "22" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: stat.accent }} />
      </div> */}
    </div>
  );
}
export function StatusPill({ status }: { status: Status }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        fontSize: 11,
        fontWeight: 500,
        padding: "3px 9px",
        borderRadius: 20,
        background: cfg.bg,
        color: cfg.color,
      }}
    >
      <span
        style={{
          width: 5,
          height: 5,
          borderRadius: "50%",
          background: cfg.dot,
          flexShrink: 0,
        }}
      />
      {cfg.label}
    </span>
  );
}

interface JobsDashboardProps<T> {
  renderItems: (item: T, index: number) => React.ReactNode;
  totalJobs: number;
  active: number;
  ended: number;
  jobs: T[];
  getKey?: (item: T, index: number) => string | number;
}

export default function JobsDashboard<T>({
  renderItems,
  getKey,
  jobs,
  totalJobs,
  ended,
  active,
}: JobsDashboardProps<T>) {
  const today = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const STATS = [
    {
      label: "Total jobs",
      value: totalJobs,
      desc: "All time",
      badge: "All",
      Icon: BriefcaseIcon,
      accent: "#378ADD",
      iconBg: "#E6F1FB",
      iconColor: "#0C447C",
      trend: "+12% this month",
      up: true,
    },
    {
      label: "Active jobs",
      value: active,
      desc: "Open & hiring",
      badge: "Live",
      Icon: ClockIcon,
      accent: "#1D9E75",
      iconBg: "#E1F5EE",
      iconColor: "#085041",
      trend: "+5 this week",
      up: true,
    },
    {
      label: "Closed jobs",
      value: ended,
      desc: "Filled or expired",
      badge: "Done",
      Icon: CheckIcon,
      accent: "#D85A30",
      iconBg: "#FAECE7",
      iconColor: "#712B13",
      trend: "−3 this week",
      up: false,
    },
  ];

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

        {/* Stats grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: 12,
            marginBottom: 24,
          }}
        >
          {STATS.map((s) => (
            <StatCard key={s.label} stat={s} />
          ))}
          <CreateJobCard
            onCreateJob={() => {
              /* wire to your modal/route */
            }}
          />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="max-w-sm mx-auto">
            <EmptyView message="no job available" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#F3F4F6",
        minHeight: "100vh",
        padding: "32px 24px",
        fontFamily: "inherit",
      }}
    >
      {/* Page header */}
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

      {/* Stats grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: 12,
          marginBottom: 24,
        }}
      >
        {STATS.map((s) => (
          <StatCard key={s.label} stat={s} />
        ))}
        <CreateJobCard
          onCreateJob={() => {
            /* wire to your modal/route */
          }}
        />
      </div>

      {/* Table section header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 7,
              background: "#fff",
              border: "0.5px solid #E5E7EB",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ListIcon />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 500, color: "#111827" }}>
              Recent postings
            </div>
            <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 1 }}>
              Your 5 latest listings
            </div>
          </div>
          <span
            style={{
              fontSize: 11,
              padding: "2px 8px",
              borderRadius: 20,
              background: "#fff",
              border: "0.5px solid #E5E7EB",
              color: "#6B7280",
              fontWeight: 500,
            }}
          >
            {totalJobs} job{totalJobs !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Table card */}
      <div
        style={{
          background: "#fff",
          border: "0.5px solid #E5E7EB",
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            tableLayout: "fixed",
          }}
        >
          <colgroup>
            <col style={{ width: "44%" }} />
            <col style={{ width: "25%" }} />
            <col style={{ width: "19%" }} />
            <col style={{ width: "12%" }} />
          </colgroup>
          <thead>
            <tr
              style={{
                background: "#F9FAFB",
                borderBottom: "0.5px solid #E5E7EB",
              }}
            >
              {(["Job title", "Date posted", "Status", ""] as const).map(
                (h, i) => (
                  <th
                    key={i}
                    style={{
                      padding: "9px 14px",
                      fontSize: 10,
                      fontWeight: 500,
                      color: "#9CA3AF",
                      textAlign: i === 3 ? "right" : "left",
                      letterSpacing: ".08em",
                      textTransform: "uppercase",
                    }}
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {totalJobs > 0 ? (
              jobs.map((job, index) => (
                <tr
                  key={getKey ? getKey(job, index) : index}
                  style={{
                    borderBottom:
                      index === totalJobs - 1 ? "none" : "0.5px solid #F3F4F6",
                  }}
                >
                  {renderItems(job, index)}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  style={{
                    padding: "36px 14px",
                    textAlign: "center",
                    fontSize: 13,
                    color: "#9CA3AF",
                  }}
                >
                  No jobs match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Footer */}
        <div
          style={{
            padding: "11px 14px",
            borderTop: "0.5px solid #F3F4F6",
            background: "#F9FAFB",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontSize: 11, color: "#9CA3AF" }}>
            Showing 5 of {totalJobs} jobs
          </span>
          <button
            style={{
              fontSize: 12,
              fontWeight: 500,
              padding: "6px 16px",
              borderRadius: 7,
              border: "0.5px solid #D1D5DB",
              background: "#fff",
              color: "#374151",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            View all <ArrowRightIcon />
          </button>
        </div>
      </div>
    </div>
  );
}
