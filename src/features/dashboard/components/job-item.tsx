import { CalendarIcon, EyeIcon } from "lucide-react";
import { StatusPill } from "./dashboard-job-listings";

interface JobProps {
    href: string;
    title: string;
    className?: string;
    subtitle?: React.ReactNode;

  }
export const JobItems = ({
    href,
    title,
    subtitle,
    className,
  }: JobProps) => {
    // const handleRemove=async(e:React.MouseEvent)=>{
    //   e.preventDefault();
    //   e.stopPropagation();
    //   if(isRemoving){
    //     return;
    //   };
    //   if(onRemove){
    //     await onRemove()
    //   }
    // }
    return (
        <>

        <td style={{ padding: "12px 14px" }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: 2 }}>{title}</div>
          <div style={{ fontSize: 11, color: "#9CA3AF" }}>{title}</div>
        </td>
        <td style={{ padding: "12px 14px" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#6B7280" }}>
            <CalendarIcon />
           {subtitle}
          </span>
        </td>
        <td style={{ padding: "12px 14px" }}>
          <StatusPill status="active" />
        </td>
        <td style={{ padding: "12px 14px", textAlign: "right" }}>
          <button
            
            style={{ fontSize: 11, fontWeight: 500, padding: "5px 11px", borderRadius: 6, border: "0.5px solid #D1D5DB", background: "transparent", color: "#6B7280", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4 }}
          >
            <EyeIcon /> View
          </button>
        </td>
        </>
    );
  };