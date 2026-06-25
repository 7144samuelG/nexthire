import { ArrowRightIcon } from "lucide-react";
import { useState } from "react";

// 2. Add this new component (place it near your other components):
export function CreateJobCard({ onCreateJob }: { onCreateJob?: () => void }) {
    const [hovered, setHovered] = useState(false);
    return (
      <div
        onClick={onCreateJob}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: hovered ? "#F9FAFB" : "#fff",
          border: `0.5px solid ${hovered ? "#D1D5DB" : "#E5E7EB"}`,
          borderRadius: 12,
          padding: 16,
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          transition: "background 0.15s, border-color 0.15s",
          minHeight: 140,
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 8,
            background: hovered ? "#E6F1FB" : "#F3F4F6",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "background 0.15s",
          }}>
            <PlusIcon color={hovered ? "#0C447C" : "#6B7280"} />
          </div>
          <span style={{
            fontSize: 10, fontWeight: 500, letterSpacing: ".06em",
            padding: "2px 7px", borderRadius: 20,
            background: "#F3F4F6", border: "0.5px solid #E5E7EB", color: "#9CA3AF",
          }}>
            New
          </span>
        </div>
  
        <div>
          <div style={{ fontSize: 14, fontWeight: 500, color: "#111827", marginBottom: 3 }}>
            Post a new job
          </div>
          <div style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 14 }}>
            Reach qualified candidates
          </div>
          <div style={{ height: "0.5px", background: "#F3F4F6", marginBottom: 10 }} />
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            fontSize: 11, fontWeight: 500, color: "#378ADD",
          }}>
            Create listing <ArrowRightIcon />
          </div>
        </div>
      </div>
    );
  }
  
  // 3. Add PlusIcon (place it with your other icon components):
  function PlusIcon({ color }: { color: string }) {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    );
  }