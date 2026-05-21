"use client";

import { useState, useEffect } from "react";

const jobData = {
  total: 248,
  active: 134,
  closed: 89,
  upcoming: 25,
};

const cards = [
  {
    id: "total",
    label: "Total Jobs",
    value: jobData.total,
    description: "All jobs ever created",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
        <line x1="12" y1="12" x2="12" y2="16" />
        <line x1="10" y1="14" x2="14" y2="14" />
      </svg>
    ),
    accent: "#6EE7B7",
    glow: "rgba(110,231,183,0.25)",
    badge: "All Time",
    trend: "+12% this month",
    trendUp: true,
  },
  {
    id: "active",
    label: "Active Jobs",
    value: jobData.active,
    description: "Currently open & hiring",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    accent: "#60A5FA",
    glow: "rgba(96,165,250,0.25)",
    badge: "Live",
    trend: "+5 this week",
    trendUp: true,
  },
  {
    id: "closed",
    label: "Closed Jobs",
    value: jobData.closed,
    description: "Positions filled or expired",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
    accent: "#F472B6",
    glow: "rgba(244,114,182,0.25)",
    badge: "Filled",
    trend: "−3 this week",
    trendUp: false,
  },
  {
    id: "upcoming",
    label: "Upcoming Jobs",
    value: jobData.upcoming,
    description: "Scheduled to open soon",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
    accent: "#FBBF24",
    glow: "rgba(251,191,36,0.25)",
    badge: "Planned",
    trend: "+8 next week",
    trendUp: true,
  },
];

function AnimatedNumber({ target, duration = 1800 }:{target:any, duration?:number}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start:any = null;
    const step = (timestamp:any) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    const raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return <span>{count}</span>;
}

export const JobStatsCards=()=> {
  const [hovered, setHovered] = useState<string | null>(null); 
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .jobs-root {
          min-height: 100vh;
          background:rgb(255, 255, 255);
          font-family: 'DM Sans', sans-serif;
          display: flex;
          flex-direction: column;
          align-items: center; 
          justify-content: center;
          padding: 48px 24px;
        }

        .jobs-header {
          text-align: center;
          margin-bottom: 52px;
          opacity: 0;
          transform: translateY(20px);
          animation: fadeUp 0.7s ease forwards;
        }

        .jobs-header-eyebrow {
          font-family: 'Syne', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #60A5FA;
          margin-bottom: 12px;
        }

        .jobs-header-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(28px, 5vw, 48px);
          font-weight: 800;
          color: #111827;
          line-height: 1.1;
          letter-spacing: -0.02em;
        }

        .jobs-header-title span {
          background: linear-gradient(90deg, #60A5FA, #6EE7B7);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .jobs-header-sub {
          margin-top: 12px;
          font-size: 15px;
          color: #6B7A99;
          font-weight: 400;
        }

        .jobs-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          width: 100%;
          max-width: 1100px;
        }

        @media (max-width: 1024px) {
          .jobs-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 560px) {
          .jobs-grid { grid-template-columns: 1fr; }
        }

        .card-wrap {
          opacity: 0;
          transform: translateY(32px);
          animation: fadeUp 0.6s ease forwards;
        }

        .card-wrap:nth-child(1) { animation-delay: 0.1s; }
        .card-wrap:nth-child(2) { animation-delay: 0.22s; }
        .card-wrap:nth-child(3) { animation-delay: 0.34s; }
        .card-wrap:nth-child(4) { animation-delay: 0.46s; }

        .card {
          position: relative;
          background: #FFFFFF;
          border: 1px solid #E5E7EB;
          border-radius: 20px;
          padding: 28px 24px 24px;
          cursor: default;
          transition: transform 0.35s cubic-bezier(.22,.68,0,1.2), border-color 0.3s ease, box-shadow 0.35s ease;
          overflow: hidden;
        }

        .card::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 20px;
          opacity: 0;
          transition: opacity 0.4s ease;
          pointer-events: none;
        }

        .card.hovered {
          transform: translateY(-6px) scale(1.01);
          border-color: rgba(255,255,255,0.18);
        }

        .card.hovered::before { opacity: 1; }

        .card-noise {
          position: absolute;
          inset: 0;
          border-radius: 20px;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
          pointer-events: none;
          opacity: 0.5;
        }

        .card-glow {
          position: absolute;
          top: -40px;
          right: -40px;
          width: 130px;
          height: 130px;
          border-radius: 50%;
          filter: blur(50px);
          opacity: 0;
          transition: opacity 0.4s ease;
          pointer-events: none;
        }

        .card.hovered .card-glow { opacity: 1; }

        .card-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 22px;
        }

        .card-icon-wrap {
          width: 46px;
          height: 46px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: transform 0.3s ease;
        }

        .card.hovered .card-icon-wrap {
          transform: rotate(-6deg) scale(1.1);
        }

        .card-icon-wrap svg {
          width: 22px;
          height: 22px;
        }

        .card-badge {
          font-family: 'Syne', sans-serif;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 4px 10px;
          border-radius: 20px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          color: #8899BB;
          transition: background 0.3s ease;
        }

        .card.hovered .card-badge {
          background: rgba(255,255,255,0.1);
        }

        .card-value {
          font-family: 'Syne', sans-serif;
          font-size: clamp(42px, 6vw, 56px);
          font-weight: 800;
          line-height: 1;
          letter-spacing: -0.04em;
          margin-bottom: 6px;
        }

        .card-label {
          font-family: 'Syne', sans-serif;
          font-size: 14px;
          font-weight: 600;
          color: #374151;
          letter-spacing: 0.01em;
          margin-bottom: 4px;
        }

        .card-desc {
          font-size: 12px;
          color: #9CA3AF;
          font-weight: 400;
          margin-bottom: 20px;
        }

        .card-divider {
          height: 1px;
          background: #F3F4F6;
          margin-bottom: 14px;
        }

        .card-trend {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 500;
        }

        .trend-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .card-bar-track {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: rgba(255,255,255,0.04);
          border-radius: 0 0 20px 20px;
          overflow: hidden;
        }

        .card-bar-fill {
          height: 100%;
          border-radius: 0 0 20px 20px;
          transition: width 1.2s cubic-bezier(.22,.68,0,1.2);
        }

        @keyframes fadeUp {
          to { opacity: 1; transform: translateY(0); }
        }

        .jobs-footer {
          margin-top: 40px;
          font-size: 12px;
          color: #3A4560;
          opacity: 0;
          animation: fadeUp 0.6s ease 0.7s forwards;
          letter-spacing: 0.04em;
        }

        .pulse-ring {
          position: absolute;
          top: 14px;
          right: 14px;
          width: 8px;
          height: 8px;
        }

        .pulse-ring::before, .pulse-ring::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 50%;
          animation: pulse 2s ease-out infinite;
        }

        .pulse-ring::after { animation-delay: 0.6s; }

        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(2.8); opacity: 0; }
        }
      `}</style>

      <div className="jobs-root">
        <div className="jobs-header">
          <div className="jobs-header-eyebrow">Dashboard Overview</div>
          <h1 className="jobs-header-title">
            Your Job <span>Insights</span>
          </h1>
          <p className="jobs-header-sub">Real-time summary of all your job postings</p>
        </div>

        <div className="jobs-grid">
          {cards.map((card, i) => {
            const isHovered = hovered === card.id;
            const pct = Math.round((card.value / jobData.total) * 100);

            return (
              <div key={card.id} className="card-wrap" style={{ animationDelay: `${0.1 + i * 0.12}s` }}>
                <div
                  className={`card${isHovered ? " hovered" : ""}`}
                  style={{
                    boxShadow: isHovered ? `0 20px 60px ${card.glow}, 0 0 0 1px ${card.accent}22` : "0 4px 20px rgba(0,0,0,0.3)",
                  }}
                  onMouseEnter={() => setHovered(card.id)}
                  onMouseLeave={() => setHovered(null)}
                >
                  {/* Noise overlay */}
                  <div className="card-noise" />

                  {/* Glow orb */}
                  <div className="card-glow" style={{ background: card.accent }} />

                  {/* Active pulse for "active" card */}
                  {card.id === "active" && (
                    <div className="pulse-ring" style={{ top: 18, right: 18 }}>
                      <div style={{
                        width: 8, height: 8, borderRadius: "50%",
                        background: card.accent, position: "absolute", inset: 0,
                        boxShadow: `0 0 8px ${card.accent}`
                      }} />
                      <style>{`
                        .pulse-ring::before, .pulse-ring::after {
                          background: ${card.accent};
                        }
                      `}</style>
                    </div>
                  )}

                  {/* Top row */}
                  <div className="card-top">
                    <div
                      className="card-icon-wrap"
                      style={{
                        background: `${card.accent}18`,
                        border: `1px solid ${card.accent}30`,
                        color: card.accent,
                      }}
                    >
                      {card.icon}
                    </div>
                    <div className="card-badge">{card.badge}</div>
                  </div>

                  {/* Number */}
                  <div className="card-value" style={{ color: card.accent }}>
                    {mounted ? <AnimatedNumber target={card.value} duration={1400 + i * 150} /> : card.value}
                  </div>

                  {/* Label & desc */}
                  <div className="card-label">{card.label}</div>
                  <div className="card-desc">{card.description}</div>

                  {/* Divider */}
                  <div className="card-divider" />

                  {/* Trend */}
                  <div className="card-trend">
                    <div
                      className="trend-dot"
                      style={{ background: card.trendUp ? "#4ADE80" : "#F87171" }}
                    />
                    <span style={{ color: card.trendUp ? "#4ADE80" : "#F87171" }}>
                      {card.trend}
                    </span>
                  </div>

                  {/* Bottom bar */}
                  <div className="card-bar-track">
                    <div
                      className="card-bar-fill"
                      style={{
                        width: mounted ? `${pct}%` : "0%",
                        background: `linear-gradient(90deg, ${card.accent}88, ${card.accent})`,
                        transitionDelay: `${0.5 + i * 0.15}s`,
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="jobs-footer">
          Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
        </div>
      </div>
    </>
  );
}